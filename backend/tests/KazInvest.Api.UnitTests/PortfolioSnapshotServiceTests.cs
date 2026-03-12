using FluentAssertions;
using KazInvest.Api.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KazInvest.Api.UnitTests;

[TestClass]
public class PortfolioSnapshotServiceTests
{
    [TestMethod]
    public void GetStartupSummary_ReturnsExpectedSamplePayload()
    {
        var service = new PortfolioSnapshotService();

        var summary = service.GetStartupSummary();

        summary.Name.Should().Be("Scaffold");
        summary.AssetCount.Should().Be(3);
    }
}
