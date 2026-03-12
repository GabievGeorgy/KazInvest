namespace KazInvest.Api.Services;

public sealed class PortfolioSnapshotService
{
    public PortfolioSummary GetStartupSummary()
    {
        return new PortfolioSummary(
            "Scaffold",
            3,
            "Replace the sample portfolio summary with real business logic.");
    }
}

public sealed record PortfolioSummary(string Name, int AssetCount, string Note);

