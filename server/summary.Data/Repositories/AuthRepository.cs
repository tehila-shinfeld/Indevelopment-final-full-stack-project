using Microsoft.EntityFrameworkCore;
using summary.Core.Entities;
using summary.Core.IRepositories;
using summary.Data;
//ushort Microsoft.EntityFrameworkCore
using System;
using System.Threading.Tasks;

public class AuthRepository : IAuthRepository
{
    private readonly DataContext _context;

    public AuthRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByNameAndPasswordAsync(string name, string password)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == name && u.PasswordHash == password);
    }
    public async Task<User> CreateUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

}
