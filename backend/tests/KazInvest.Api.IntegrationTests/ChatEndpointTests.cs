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
            messages => Task.FromResult(new OpenRouterChatCompletion($"Echo: {messages[^1].Content}", "stub-model"))));
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync(
            "/api/chat",
            new ChatRequest([new ChatMessageRequest("user", "Hello")]));

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

        var response = await client.PostAsJsonAsync(
            "/api/chat",
            new ChatRequest([new ChatMessageRequest("user", " ")]));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        using var payload = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        payload.RootElement.GetProperty("errors").GetProperty("messages")[0].GetString()
            .Should().Be("Message content is required.");
    }

    [TestMethod]
    public async Task Post_Chat_ForwardsMessageHistoryToChatClient()
    {
        IReadOnlyList<OpenRouterChatMessage>? forwardedMessages = null;

        await using var factory = CreateFactory(new StubOpenRouterChatClient(
            messages =>
            {
                forwardedMessages = messages;
                return Task.FromResult(new OpenRouterChatCompletion("Context-aware reply", "stub-model"));
            }));
        using var client = factory.CreateClient();

        var request = new ChatRequest(
        [
            new ChatMessageRequest("user", "Hello"),
            new ChatMessageRequest("assistant", "Hi there"),
            new ChatMessageRequest("user", "What about my portfolio?"),
        ]);

        var response = await client.PostAsJsonAsync("/api/chat", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        forwardedMessages.Should().NotBeNull();
        forwardedMessages!.Select(message => message.Role).Should().Equal("user", "assistant", "user");
        forwardedMessages.Select(message => message.Content).Should().Equal("Hello", "Hi there", "What about my portfolio?");
    }

    [TestMethod]
    public async Task Post_Chat_WhenProviderFails_ReturnsBadGateway()
    {
        await using var factory = CreateFactory(new StubOpenRouterChatClient(
            _ => Task.FromException<OpenRouterChatCompletion>(
                ChatProviderException.UpstreamFailure(HttpStatusCode.TooManyRequests))));
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync(
            "/api/chat",
            new ChatRequest([new ChatMessageRequest("user", "Hello")]));

        response.StatusCode.Should().Be(HttpStatusCode.BadGateway);
    }

    [TestMethod]
    public async Task Post_Chat_WhenProviderTimesOut_ReturnsGatewayTimeout()
    {
        await using var factory = CreateFactory(new StubOpenRouterChatClient(
            _ => Task.FromException<OpenRouterChatCompletion>(ChatProviderException.Timeout())));
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync(
            "/api/chat",
            new ChatRequest([new ChatMessageRequest("user", "Hello")]));

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
        Func<IReadOnlyList<OpenRouterChatMessage>, Task<OpenRouterChatCompletion>> onCreateCompletion) : IOpenRouterChatClient
    {
        public Task<OpenRouterChatCompletion> CreateCompletionAsync(
            IReadOnlyList<OpenRouterChatMessage> messages,
            CancellationToken cancellationToken = default)
        {
            return onCreateCompletion(messages);
        }
    }
}
