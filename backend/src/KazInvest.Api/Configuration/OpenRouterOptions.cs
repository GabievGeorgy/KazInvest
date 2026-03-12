using System.ComponentModel.DataAnnotations;

namespace KazInvest.Api.Configuration;

public sealed class OpenRouterOptions
{
    public const string SectionName = "OpenRouter";

    [Required]
    [Url]
    public string BaseUrl { get; init; } = "https://openrouter.ai/api/v1/";

    [Required]
    public string ChatCompletionsPath { get; init; } = "chat/completions";

    [Required]
    public string Model { get; init; } = "openai/gpt-4o-mini";

    [Range(1, 300)]
    public int TimeoutSeconds { get; init; } = 60;

    public string ApiKey { get; init; } = string.Empty;

    public string? Referrer { get; init; }

    public string? ApplicationName { get; init; }
}

