using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using KazInvest.Api.Configuration;
using Microsoft.Extensions.Options;

namespace KazInvest.Api.Services.OpenRouter;

public sealed class OpenRouterChatClient(HttpClient httpClient, IOptions<OpenRouterOptions> options) : IOpenRouterChatClient
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly OpenRouterOptions _options = options.Value;

    public async Task<OpenRouterChatCompletion> CreateCompletionAsync(
        string message,
        CancellationToken cancellationToken = default)
    {
        var request = new OpenRouterChatRequest(
            _options.Model,
            [new OpenRouterChatMessage("user", message)]);

        using var response = await _httpClient.PostAsJsonAsync(
            _options.ChatCompletionsPath,
            request,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<OpenRouterChatResponse>(cancellationToken);

        if (payload?.Choices is not [{ Message.Content: { } content }])
        {
            throw new InvalidOperationException("OpenRouter response did not contain a chat completion.");
        }

        return new OpenRouterChatCompletion(content, payload.Model);
    }

    public static void ConfigureHttpClient(HttpClient httpClient, OpenRouterOptions options)
    {
        httpClient.BaseAddress = new Uri(options.BaseUrl, UriKind.Absolute);
        httpClient.Timeout = TimeSpan.FromSeconds(options.TimeoutSeconds);
        httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));

        if (!string.IsNullOrWhiteSpace(options.ApiKey))
        {
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", options.ApiKey);
        }

        if (!string.IsNullOrWhiteSpace(options.Referrer))
        {
            httpClient.DefaultRequestHeaders.Referrer = new Uri(options.Referrer, UriKind.Absolute);
        }

        if (!string.IsNullOrWhiteSpace(options.ApplicationName))
        {
            httpClient.DefaultRequestHeaders.Remove("X-Title");
            httpClient.DefaultRequestHeaders.Add("X-Title", options.ApplicationName);
        }
    }

    private sealed record OpenRouterChatRequest(
        [property: JsonPropertyName("model")] string Model,
        [property: JsonPropertyName("messages")] IReadOnlyList<OpenRouterChatMessage> Messages);

    private sealed record OpenRouterChatResponse(
        [property: JsonPropertyName("model")] string Model,
        [property: JsonPropertyName("choices")] IReadOnlyList<OpenRouterChoice> Choices);

    private sealed record OpenRouterChoice(
        [property: JsonPropertyName("message")] OpenRouterChatMessage Message);
}

public sealed record OpenRouterChatCompletion(string Content, string Model);

public sealed record OpenRouterChatMessage(
    [property: JsonPropertyName("role")] string Role,
    [property: JsonPropertyName("content")] string Content);

