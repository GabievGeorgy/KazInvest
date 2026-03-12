namespace KazInvest.Api.Services.OpenRouter;

public interface IOpenRouterChatClient
{
    Task<OpenRouterChatCompletion> CreateCompletionAsync(
        IReadOnlyList<OpenRouterChatMessage> messages,
        CancellationToken cancellationToken = default);
}
