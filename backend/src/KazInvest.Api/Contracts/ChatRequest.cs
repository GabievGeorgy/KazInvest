namespace KazInvest.Api.Contracts;

public sealed record ChatRequest(IReadOnlyList<ChatMessageRequest> Messages);
