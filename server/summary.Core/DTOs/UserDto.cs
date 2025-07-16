using summary.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.DTOs
{
    public class UserDto
    {
        public int? Id { get; set; } // מזהה משתמש

        public string Username { get; set; } // שם משתמש

        public string PasswordHash { get; set; } // סיסמה (מוצפנת)

        public string Company { get; set; } // חברה

        public string Email { get; set; } // מייל

        public string? Role { get; set; } // תפקיד

    }
}
