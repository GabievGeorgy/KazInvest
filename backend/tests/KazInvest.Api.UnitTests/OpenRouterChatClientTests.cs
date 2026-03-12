using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using KazInvest.Api.Configuration;
using KazInvest.Api.Services.OpenRouter;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KazInvest.Api.UnitTests;

[TestClass]
public class OpenRouterChatClientTests
{
    [TestMethod]
    public async Task CreateCompletionAsync_ReturnsCompletion_WhenResponseIsValid()
    {
        var handler = new StubHttpMessageHandler(
            _ => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = JsonContent.Create(
                    new
                    {
                        model = "openai/gpt-4o-mini",
                        choices = new[]
                        {
                            new
                            {
                                message = new
                                {
                                    role = "assistant",
                                    content = "Hello from OpenRouter",
                                },
                            },
                        },
                    }),
            });
        using var httpClient = new HttpClient(handler);
        var client = CreateClient(httpClient);

        var response = await client.CreateCompletionAsync("Hello");

        response.Content.Should().Be("Hello from OpenRouter");
        response.Model.Should().Be("openai/gpt-4o-mini");
    }

    [TestMethod]
    public async Task CreateCompletionAsync_ThrowsConfigurationException_WhenApiKeyMissing()
    {
        using var httpClient = new HttpClient(new StubHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)));
        var client = CreateClient(httpClient, new OpenRouterOptions { ApiKey = "" });

        var action = async () => await client.CreateCompletionAsync("Hello");

        var exception = await action.Should().ThrowAsync<ChatProviderException>();
        exception.Which.ErrorType.Should().Be(ChatProviderErrorType.Configuration);
        exception.Which.StatusCode.Should().Be(StatusCodes.Status503ServiceUnavailable);
    }

    [TestMethod]
    public async Task CreateCompletionAsync_ThrowsInvalidResponse_WhenChoicesAreMissing()
    {
        var handler = new StubHttpMessageHandler(
            _ => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = JsonContent.Create(new { model = "openai/gpt-4o-mini", choices = Array.Empty<object>() }),
            });
        using var httpClient = new HttpClient(handler);
        var client = CreateClient(httpClient);

        var action = async () => await client.CreateCompletionAsync("Hello");

        var exception = await action.Should().ThrowAsync<ChatProviderException>();
        exception.Which.ErrorType.Should().Be(ChatProviderErrorType.InvalidResponse);
        exception.Which.StatusCode.Should().Be(StatusCodes.Status502BadGateway);
        exception.Which.Title.Should().Be("Invalid chat provider response");
    }

    [TestMethod]
    public void ConfigureHttpClient_SetsExpectedHeaders()
    {
        using var httpClient = new HttpClient();
        var options = new OpenRouterOptions
        {
            ApiKey = "secret-key",
            Referrer = "http://localhost:5173",
            ApplicationName = "KazInvest",
        };

        OpenRouterChatClient.ConfigureHttpClient(httpClient, options);

        httpClient.BaseAddress.Should().Be(new Uri("https://openrouter.ai/api/v1/"));
        httpClient.DefaultRequestHeaders.Authorization?.Scheme.Should().Be("Bearer");
        httpClient.DefaultRequestHeaders.Authorization?.Parameter.Should().Be("secret-key");
        httpClient.DefaultRequestHeaders.Referrer.Should().Be(new Uri("http://localhost:5173"));
        httpClient.DefaultRequestHeaders.GetValues("X-Title").Should().ContainSingle().Which.Should().Be("KazInvest");
    }

    private static OpenRouterChatClient CreateClient(HttpClient httpClient, OpenRouterOptions? options = null)
    {
        var resolvedOptions = options ?? new OpenRouterOptions { ApiKey = "secret-key" };

        OpenRouterChatClient.ConfigureHttpClient(httpClient, resolvedOptions);

        return new OpenRouterChatClient(
            httpClient,
            Options.Create(resolvedOptions),
            NullLogger<OpenRouterChatClient>.Instance);
    }

    private sealed class StubHttpMessageHandler(
        Func<HttpRequestMessage, HttpResponseMessage> onSend) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            return Task.FromResult(onSend(request));
        }
    }
}
