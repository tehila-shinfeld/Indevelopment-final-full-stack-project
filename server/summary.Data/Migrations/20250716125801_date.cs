using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace summary.Data.Migrations
{
    /// <inheritdoc />
    public partial class date : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Meetings",
                keyColumn: "MeetingDate",
                keyValue: null,
                column: "MeetingDate",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MeetingDate",
                table: "Meetings",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "MeetingDate",
                table: "Meetings",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
