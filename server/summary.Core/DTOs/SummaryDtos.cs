using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core
{
    // DTO של בקשה לשמירה
    public class FileSummarizeRequestDto
    {
        public string FileUrl { get; set; }
    }

    // DTO של סיכום קובץ
    public class FileSummaryDto
    {
        public string FileUrl { get; set; }
        public string Summary { get; set; }
    }

    // Entity של סיכום קובץ
    public class FileSummary
    {
        public int Id { get; set; }
        public string FileUrl { get; set; }
        public string Summary { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
