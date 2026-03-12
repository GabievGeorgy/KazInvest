using System.ComponentModel.DataAnnotations;

namespace KazInvest.Api.Configuration;

public sealed class FrontendOptions
{
    public const string SectionName = "Frontend";

    [Required]
    [MinLength(1)]
    public string[] AllowedOrigins { get; init; } = ["http://localhost:5173"];
}

