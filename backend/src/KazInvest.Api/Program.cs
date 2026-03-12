using KazInvest.Api.Services;

var builder = WebApplication.CreateBuilder(args);

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
