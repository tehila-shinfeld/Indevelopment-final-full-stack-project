using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace summary.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMeetingDateToMeeting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Meetings",
                newName: "MeetingDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MeetingDate",
                table: "Meetings",
                newName: "CreatedAt");
        }
    }
}
