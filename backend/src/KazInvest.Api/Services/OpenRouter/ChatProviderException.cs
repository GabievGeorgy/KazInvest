using System.Net;

namespace KazInvest.Api.Services.OpenRouter;

public enum ChatProviderErrorType
{
    Configuration,
    Timeout,
    UpstreamFailure,
    InvalidResponse,
}

public sealed class ChatProviderException : Exception
{
    public ChatProviderException(
        ChatProviderErrorType errorType,
        string title,
        string detail,
        int statusCode,
        Exception? innerException = null)
        : base(detail, innerException)
    {
        ErrorType = errorType;
        Title = title;
        Detail = detail;
        StatusCode = statusCode;
    }

    public ChatProviderErrorType ErrorType { get; }

    public string Title { get; }

    public string Detail { get; }

    public int StatusCode { get; }

    public static ChatProviderException Configuration(string detail)
        => new(
            ChatProviderErrorType.Configuration,
            "Chat provider is not configured",
            detail,
            StatusCodes.Status503ServiceUnavailable);

    public static ChatProviderException InvalidResponse(string detail, Exception? innerException = null)
        => new(
            ChatProviderErrorType.InvalidResponse,
            "Invalid chat provider response",
            detail,
            StatusCodes.Status502BadGateway,
            innerException);

    public static ChatProviderException Timeout(Exception? innerException = null)
        => new(
            ChatProviderErrorType.Timeout,
            "Chat provider timeout",
            "The chat provider did not respond in time.",
            StatusCodes.Status504GatewayTimeout,
            innerException);

    public static ChatProviderException UpstreamFailure(HttpStatusCode? statusCode, Exception? innerException = null)
    {
        var detail = statusCode is null
            ? "The chat provider request failed."
            : $"The chat provider returned {(int)statusCode} {statusCode}.";

        return new(
            ChatProviderErrorType.UpstreamFailure,
            "Chat provider request failed",
            detail,
            StatusCodes.Status502BadGateway,
            innerException);
    }
}
