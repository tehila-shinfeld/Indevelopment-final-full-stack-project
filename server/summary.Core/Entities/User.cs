namespace summary.Core.Entities
{
    public class User
    {
        public int? Id { get; set; } // מזהה משתמש

        public string? Username { get; set; } // שם משתמש

        public string? PasswordHash { get; set; } // סיסמה (מוצפנת)

        public string? Company { get; set; } // חברה

        public string? Role { get; set; } // תפקיד

        public string? Email { get; set; } // מייל

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow; // תאריך יצירה

        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow; // תאריך עדכון

        public List<Meeting>? Meetings { get; set; } = new List<Meeting>();  // קשר רבים לרבים עם ישיבות נוספות

        public List<Meeting>? MeetingsUserCreate { get; set; } = new List<Meeting>(); // ישיבות שיצר המשתמש
    }
}

