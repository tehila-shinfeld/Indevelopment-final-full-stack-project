using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.Entities
{
   public class Meeting
    {
        public int Id { get; set; } // מזהה ישיבה

        public string? Name { get; set; } // שם הישיבה
        public User? CreatedByUser { get; set; } // הקשר למשתמש שיצר את הישיבה

        public int? CreatedByUserId { get; set; } // מזהה המשתמש שיצר את הישיבה

        public string? TranscriptionLink { get; set; } // קישור לתמלול בענן

        public string? SummaryContent { get; set; } // קישור לסיכום בענן

        public DateTime? MeetingDate { get; set; } = DateTime.UtcNow; // תאריך הפגישה

        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow; // תאריך עדכון

        //public string? MeetinDate { get; set; }

        public List<User>? Users { get; set; } = new List<User>(); // קשר רבים לרבים עם משתמשים נוספים בישיבה
    }
}

