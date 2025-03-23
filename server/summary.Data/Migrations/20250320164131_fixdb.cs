using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace summary.Data.Migrations
{
    /// <inheritdoc />
    public partial class fixdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SummaryLink",
                table: "Meetings",
                newName: "SummaryContent");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SummaryContent",
                table: "Meetings",
                newName: "SummaryLink");
        }
    }
}
