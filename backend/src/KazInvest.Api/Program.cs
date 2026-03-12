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

app.Run();

public partial class Program;
