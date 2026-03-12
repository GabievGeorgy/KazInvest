namespace KazInvest.Api.Services.OpenRouter;

public interface IOpenRouterChatClient
{
    Task<OpenRouterChatCompletion> CreateCompletionAsync(string message, CancellationToken cancellationToken = default);
}

