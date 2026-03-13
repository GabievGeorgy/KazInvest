using KazInvest.Api.Contracts;

namespace KazInvest.Api.Handlers.Chat;

public static class ChatRequestValidation
{
    private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        "user",
        "assistant",
    };

    public static Dictionary<string, string[]>? Validate(ChatRequest request)
    {
        if (request.Messages.Count == 0)
        {
            return new Dictionary<string, string[]>
            {
                ["messages"] = ["At least one message is required."],
            };
        }

        var validationErrors = new Dictionary<string, string[]>();

        if (request.Messages.Any(message => string.IsNullOrWhiteSpace(message.Content)))
        {
            validationErrors["messages"] = ["Message content is required."];
        }

        if (request.Messages.Any(message => !AllowedRoles.Contains(message.Role)))
        {
            validationErrors["messages.role"] =
            [
                "Message role must be one of: user, assistant.",
            ];
        }

        return validationErrors.Count > 0 ? validationErrors : null;
    }
}
