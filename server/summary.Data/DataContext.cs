using Microsoft.EntityFrameworkCore;
using summary.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Data
{
    public class DataContext : DbContext
    {
        public DbSet<Meeting> Meetings { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=my_db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // קשר רבים-לרבים בין משתמשים לישיבות
            modelBuilder.Entity<User>()
                .HasMany(u => u.Meetings)
                .WithMany(m => m.Users)
                .UsingEntity(j => j.ToTable("UserMeeting"));

            // קשר אחד-לרבים: כל ישיבה נוצרה ע"י משתמש אחד
            modelBuilder.Entity<Meeting>()
                .HasOne(m => m.CreatedByUser)
                .WithMany(u => u.MeetingsUserCreate) // משתמש אחד יכול ליצור הרבה ישיבות
                .HasForeignKey(m => m.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict); // מונע מחיקה cascading של משתמשים
        }
    }
}

