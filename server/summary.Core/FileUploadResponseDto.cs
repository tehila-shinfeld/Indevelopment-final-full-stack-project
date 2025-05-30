using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core
{
    public class FileUploadResponseDto
    {
        public int? FileId { get; set; }
        public string FileUrl { get; set; } = string.Empty;
        public string S3Url { get; set; }
    }
}
