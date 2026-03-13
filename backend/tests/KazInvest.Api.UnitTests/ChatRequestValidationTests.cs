using FluentAssertions;
using KazInvest.Api.Contracts;
using KazInvest.Api.Handlers.Chat;
using KazInvest.Api.Services.OpenRouter;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KazInvest.Api.UnitTests;

[TestClass]
public class ChatRequestValidationTests
{
    [TestMethod]
    public void Validate_ReturnsError_WhenMessagesMissing()
    {
        var request = new ChatRequest([]);

        var errors = ChatRequestValidation.Validate(request);

        errors.Should().NotBeNull();
        errors!
            ["messages"]
            .Should()
            .ContainSingle()
            .Which.Should()
            .Be("At least one message is required.");
    }

    [TestMethod]
    public void Validate_ReturnsError_WhenRoleInvalid()
    {
        var request = new ChatRequest([new ChatMessageRequest("bot", "Hello")]);

        var errors = ChatRequestValidation.Validate(request);

        errors.Should().NotBeNull();
        errors!
            ["messages.role"]
            .Should()
            .ContainSingle()
            .Which.Should()
            .Be("Message role must be one of: user, assistant.");
    }

    [TestMethod]
    public void Validate_ReturnsNull_WhenRequestValid()
    {
        var request = new ChatRequest([
            new ChatMessageRequest("user", "Hello"),
            new ChatMessageRequest("assistant", "Hi there"),
        ]);

        var errors = ChatRequestValidation.Validate(request);

        errors.Should().BeNull();
    }

    [TestMethod]
    public void ToOpenRouterMessages_MapsRequestMessages()
    {
        var request = new ChatRequest([
            new ChatMessageRequest("user", "Hello"),
            new ChatMessageRequest("assistant", "Hi there"),
        ]);

        var result = ChatRequestMappings.ToOpenRouterMessages(request);

        result
            .Should()
            .Equal([
                new OpenRouterChatMessage("user", "Hello"),
                new OpenRouterChatMessage("assistant", "Hi there"),
            ]);
    }
}
