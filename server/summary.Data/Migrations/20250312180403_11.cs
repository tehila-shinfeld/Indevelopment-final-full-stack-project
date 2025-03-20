using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace summary.Data.Migrations
{
    /// <inheritdoc />
    public partial class _11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingUser_Meetings_MeetingsId",
                table: "MeetingUser");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingUser_Users_UsersId",
                table: "MeetingUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MeetingUser",
                table: "MeetingUser");

            migrationBuilder.RenameTable(
                name: "MeetingUser",
                newName: "UserMeeting");

            migrationBuilder.RenameIndex(
                name: "IX_MeetingUser_UsersId",
                table: "UserMeeting",
                newName: "IX_UserMeeting_UsersId");

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Meetings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserMeeting",
                table: "UserMeeting",
                columns: new[] { "MeetingsId", "UsersId" });

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_CreatedByUserId",
                table: "Meetings",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meetings_Users_CreatedByUserId",
                table: "Meetings",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMeeting_Meetings_MeetingsId",
                table: "UserMeeting",
                column: "MeetingsId",
                principalTable: "Meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMeeting_Users_UsersId",
                table: "UserMeeting",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meetings_Users_CreatedByUserId",
                table: "Meetings");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMeeting_Meetings_MeetingsId",
                table: "UserMeeting");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMeeting_Users_UsersId",
                table: "UserMeeting");

            migrationBuilder.DropIndex(
                name: "IX_Meetings_CreatedByUserId",
                table: "Meetings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserMeeting",
                table: "UserMeeting");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Meetings");

            migrationBuilder.RenameTable(
                name: "UserMeeting",
                newName: "MeetingUser");

            migrationBuilder.RenameIndex(
                name: "IX_UserMeeting_UsersId",
                table: "MeetingUser",
                newName: "IX_MeetingUser_UsersId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MeetingUser",
                table: "MeetingUser",
                columns: new[] { "MeetingsId", "UsersId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingUser_Meetings_MeetingsId",
                table: "MeetingUser",
                column: "MeetingsId",
                principalTable: "Meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingUser_Users_UsersId",
                table: "MeetingUser",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
