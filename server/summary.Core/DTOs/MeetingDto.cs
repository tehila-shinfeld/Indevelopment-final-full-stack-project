using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.DTOs
{
    public class MeetingDto
    {
        public int Id { get; set; } // מזהה ישיבה

        public string Name { get; set; } // שם הישיבה

        public string TranscriptionLink { get; set; } // קישור לתמלול בענן

        public string SummaryContent { get; set; } // קישור לסיכום בענן

        public DateTime MeetingDate { get; set; }

        //public DATE

    }
}
