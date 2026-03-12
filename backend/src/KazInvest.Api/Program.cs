using KazInvest.Api.Contracts;
using KazInvest.Api.Configuration;
using KazInvest.Api.Services;
using KazInvest.Api.Services.OpenRouter;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddOptions<OpenRouterOptions>()
    .Bind(builder.Configuration.GetSection(OpenRouterOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(
        static options => Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out _),
        "OpenRouter:BaseUrl must be an absolute URI.")
    .ValidateOnStart();

builder.Services.AddHttpClient<IOpenRouterChatClient, OpenRouterChatClient>()
    .ConfigureHttpClient(
        static (serviceProvider, httpClient) =>
        {
            var options = serviceProvider.GetRequiredService<IOptions<OpenRouterOptions>>().Value;
            OpenRouterChatClient.ConfigureHttpClient(httpClient, options);
        });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();
builder.Services.AddSingleton<PortfolioSnapshotService>();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

app.MapGet("/health", () => TypedResults.Ok(new { status = "ok" }));

app.MapGet(
    "/api/portfolio/summary",
    (PortfolioSnapshotService service) => TypedResults.Ok(service.GetStartupSummary()));

app.MapPost(
        "/api/chat",
        async Task<IResult> (
            ChatRequest request,
            IOpenRouterChatClient chatClient,
            CancellationToken cancellationToken) =>
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return TypedResults.ValidationProblem(
                    new Dictionary<string, string[]>
                    {
                        ["message"] = ["Message is required."],
                    });
            }

            try
            {
                var completion = await chatClient.CreateCompletionAsync(request.Message, cancellationToken);

                return TypedResults.Ok(new ChatResponse(completion.Content, completion.Model));
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                return TypedResults.Problem(
                    title: "Chat provider timeout",
                    detail: "The chat provider did not respond in time.",
                    statusCode: StatusCodes.Status504GatewayTimeout);
            }
            catch (HttpRequestException exception)
            {
                var detail = exception.StatusCode is null
                    ? "The chat provider request failed."
                    : $"The chat provider returned {(int)exception.StatusCode} {exception.StatusCode}.";

                return TypedResults.Problem(
                    title: "Chat provider request failed",
                    detail: detail,
                    statusCode: StatusCodes.Status502BadGateway);
            }
            catch (InvalidOperationException exception)
            {
                return TypedResults.Problem(
                    title: "Invalid chat provider response",
                    detail: exception.Message,
                    statusCode: StatusCodes.Status502BadGateway);
            }
        })
    .WithName("CreateChatCompletion");

app.Run();

public partial class Program;
