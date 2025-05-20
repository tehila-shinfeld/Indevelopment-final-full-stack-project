using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core
{
    public class AssignFileRequest
    {
        public string FileUrl { get; set; }
        public List<int> UserIds { get; set; }
    }
}
