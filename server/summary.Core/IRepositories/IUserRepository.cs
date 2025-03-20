using summary.Core.Entities;
using System.Collections.Generic;

namespace summary.Core.IRepositories
{
    public interface IUserRepository
    {
        public IEnumerable<User> GetAllUsers();
        public User GetUserById(int id);
        public void AddUser(User user);
        public User ChangeUser(int id, User user);
        public User Delete(int id);
    }
}
