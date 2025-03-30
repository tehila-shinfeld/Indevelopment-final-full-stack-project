using summary.Core.Entities;
using System.Collections.Generic;

namespace summary.Core.IRepositories
{
    public interface IUserRepository
    {
        public IEnumerable<User> GetAllUsers();
        public IEnumerable<User> GetAllByComp(string comp);
        public User GetUserById(int id);
        public void AddUser(User user);
        public User ChangeUser(int id, User user);
        public User Delete(int id);
        public Task<List<User>> GetUsersByIdsAsync(List<int> userIds);
        public Task<bool> UserExistsAsync(int userId);


    }
}
