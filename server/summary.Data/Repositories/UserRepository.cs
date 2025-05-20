using Microsoft.EntityFrameworkCore;
using summary.Core.Entities;
using summary.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace summary.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _dataContext;

        public UserRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _dataContext.Users.Include(f => f.Meetings);
        }
        public async Task<List<User>> GetAllByCompAsync(string comp)
        {
            return await _dataContext.Users
                .Include(f => f.Meetings)
                .Where(u => u.Company == comp)
                .ToListAsync();
        }

        public User GetUserById(int id)
        {
            return _dataContext.Users.FirstOrDefault(u => u.Id == id);
        }
        public void AddUser(User user)
        {
            _dataContext.Users.Add(user);
        }
        public User ChangeUser(int id, User user)
        {
            var existingUser = _dataContext.Users.FirstOrDefault(u => u.Id == id);
            if (existingUser != null)
            {
                existingUser.Username = user.Username;
                existingUser.PasswordHash = user.PasswordHash;
                existingUser.Company = user.Company;
                existingUser.Role = user.Role;
                existingUser.Email = user.Email;
                existingUser.UpdatedAt = DateTime.UtcNow;
                return existingUser;
            }
            return null;
        }
        public User Delete(int id)
        {
            var user = _dataContext.Users.FirstOrDefault(u => u.Id == id);
            if (user != null)
            {
                _dataContext.Users.Remove(user);
                return user;
            }
            return null;
        }


        public async Task<List<User>> GetUsersByIdsAsync(List<int> userIds)
        {
            return await _dataContext.Users
                .Where(u => userIds.Contains((int)u.Id))
                .Include(u => u.Meetings)
                .ToListAsync();
        }

        public async Task<bool> UserExistsAsync(int userId)
        {
            return await _dataContext.Users.AnyAsync(u => u.Id == userId);
        }


    }
}
