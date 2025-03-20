using summary.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.IRepositories
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByNameAndPasswordAsync(string name, string password);
        Task<User> CreateUserAsync(User user);

    }
}
