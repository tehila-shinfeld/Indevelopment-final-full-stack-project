using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core
{
    public class FileDetailsDto
    {
        public string FileUrl { get; set; } = string.Empty;
        public string UploadedBy { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }

    }
}
