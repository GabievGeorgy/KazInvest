using KazInvest.Api.Contracts;
using KazInvest.Api.Configuration;
using KazInvest.Api.Handlers.Chat;
using KazInvest.Api.Services.OpenRouter;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddOptions<FrontendOptions>()
    .Bind(builder.Configuration.GetSection(FrontendOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(
        static options => options.AllowedOrigins.All(origin => Uri.TryCreate(origin, UriKind.Absolute, out _)),
        "Frontend:AllowedOrigins must contain only absolute URIs.")
    .ValidateOnStart();

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
builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(
            "frontend",
            policy =>
            {
                var allowedOrigins = builder.Configuration
                    .GetSection(FrontendOptions.SectionName)
                    .Get<FrontendOptions>()?.AllowedOrigins ?? ["http://localhost:5173"];

                policy
                    .WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
    });

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors("frontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

app.MapGet("/health", () => TypedResults.Ok(new { status = "ok" }));

app.MapPost(
        "/api/chat",
        async Task<Results<Ok<ChatResponse>, ValidationProblem, ProblemHttpResult>> (
            ChatRequest request,
            IOpenRouterChatClient chatClient,
            ILogger<Program> logger,
            CancellationToken cancellationToken) =>
        {
            var validationErrors = ChatRequestValidation.Validate(request);

            if (validationErrors is not null)
            {
                return TypedResults.ValidationProblem(validationErrors);
            }

            try
            {
                var completion = await chatClient.CreateCompletionAsync(
                    ChatRequestMappings.ToOpenRouterMessages(request),
                    cancellationToken);

                return TypedResults.Ok(new ChatResponse(completion.Content, completion.Model));
            }
            catch (ChatProviderException exception)
            {
                logger.LogWarning(
                    exception,
                    "Chat request failed with provider error type {ErrorType} and status code {StatusCode}.",
                    exception.ErrorType,
                    exception.StatusCode);

                return TypedResults.Problem(
                    title: exception.Title,
                    detail: exception.Detail,
                    statusCode: exception.StatusCode);
            }
        })
    .WithName("CreateChatCompletion");

app.Run();

public partial class Program;
