using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core
{
    public class SaveSummaryRequestDto
    {
        public string FileUrl { get; set; }
        public string Summary { get; set; }
    }
}
