using summary.Core.DTOs;
using summary.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.IServices
{
    public interface IAuthService
    {
        Task<LoginResponse> AuthenticateUserAsync(string name, string password);
        Task<LoginResponse> RegisterUserAsync(UserDto UserDto);
    }
}
