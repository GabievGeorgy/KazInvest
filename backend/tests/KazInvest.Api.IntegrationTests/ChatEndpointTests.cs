using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using KazInvest.Api.Contracts;
using KazInvest.Api.Services.OpenRouter;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KazInvest.Api.IntegrationTests;

[TestClass]
public class ChatEndpointTests
{
    [TestMethod]
    public async Task Post_Chat_ReturnsReplyFromChatClient()
    {
        await using var factory = CreateFactory(new StubOpenRouterChatClient(
            message => Task.FromResult(new OpenRouterChatCompletion($"Echo: {message}", "stub-model"))));
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/chat", new ChatRequest("Hello"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var payload = await response.Content.ReadFromJsonAsync<ChatResponse>();
        payload.Should().NotBeNull();
        payload!.Reply.Should().Be("Echo: Hello");
        payload.Model.Should().Be("stub-model");
    }

    [TestMethod]
    public async Task Post_Chat_WithEmptyMessage_ReturnsBadRequest()
    {
        await using var factory = CreateFactory(new StubOpenRouterChatClient(
            _ => Task.FromResult(new OpenRouterChatCompletion("unused", "unused"))));
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/chat", new ChatRequest(" "));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        using var payload = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        payload.RootElement.GetProperty("errors").GetProperty("message")[0].GetString()
            .Should().Be("Message is required.");
    }

    [TestMethod]
    public async Task Post_Chat_WhenProviderFails_ReturnsBadGateway()
    {
        await using var factory = CreateFactory(new StubOpenRouterChatClient(
            _ => Task.FromException<OpenRouterChatCompletion>(
                ChatProviderException.UpstreamFailure(HttpStatusCode.TooManyRequests))));
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/chat", new ChatRequest("Hello"));

        response.StatusCode.Should().Be(HttpStatusCode.BadGateway);
    }

    [TestMethod]
    public async Task Post_Chat_WhenProviderTimesOut_ReturnsGatewayTimeout()
    {
        await using var factory = CreateFactory(new StubOpenRouterChatClient(
            _ => Task.FromException<OpenRouterChatCompletion>(ChatProviderException.Timeout())));
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/chat", new ChatRequest("Hello"));

        response.StatusCode.Should().Be(HttpStatusCode.GatewayTimeout);
    }

    private static WebApplicationFactory<Program> CreateFactory(IOpenRouterChatClient chatClient)
    {
        return new WebApplicationFactory<Program>()
            .WithWebHostBuilder(
                builder =>
                {
                    builder.UseEnvironment("Development");
                    builder.ConfigureServices(
                        services =>
                        {
                            services.RemoveAll<IOpenRouterChatClient>();
                            services.AddSingleton(chatClient);
                        });
                });
    }

    private sealed class StubOpenRouterChatClient(
        Func<string, Task<OpenRouterChatCompletion>> onCreateCompletion) : IOpenRouterChatClient
    {
        public Task<OpenRouterChatCompletion> CreateCompletionAsync(
            string message,
            CancellationToken cancellationToken = default)
        {
            return onCreateCompletion(message);
        }
    }
}
