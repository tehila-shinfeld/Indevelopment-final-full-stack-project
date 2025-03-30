using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core
{
    public class AssignFileRequest
    {
        public string FileUrl { get; set; } // מזהה הקובץ
        public List<int> UserserIds { get; set; } = new List<int>(); // רשימת מזהי לקוחות
    }
}
