using KazInvest.Api.Services.OpenRouter;
using KazInvest.Api.Contracts;

namespace KazInvest.Api.Handlers.Chat;

public static class ChatRequestMappings
{
    public static IReadOnlyList<OpenRouterChatMessage> ToOpenRouterMessages(ChatRequest request)
    {
        return request.Messages
            .Select(message => new OpenRouterChatMessage(message.Role, message.Content))
            .ToArray();
    }
}
