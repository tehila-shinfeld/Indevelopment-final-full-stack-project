using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.DTOs
{
    public class FileDto
    {
        public string FileName { get; set; } // שם הקובץ

        public string FileUrl { get; set; } // הקישור הזמני (Presigned URL)

        public string UploadBy { get; set; } // מי העלה את הקובץ
    }
}
