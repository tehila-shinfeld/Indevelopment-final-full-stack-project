using summary.Core.IRepositories;
using summary.Core.IServices;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using summary.Core.DTOs;
using summary.Core.Entities;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Text;

namespace summary.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthService(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task<string> AuthenticateUserAsync(string username, string password)
        {
            var user = await _authRepository.GetUserByNameAsync(username);
            if (user == null)
            {
                return null;
            }

            // השוואת הסיסמה
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
            {
                return null; // אם הסיסמה לא נכונה
            }

            return GenerateJwtToken(user.Username, user.Role, user.Company);
        }

        public async Task<string> RegisterUserAsync(UserDto registerUserDto)
        {
            var existingUser = await _authRepository.GetUserByNameAsync(registerUserDto.Username);

            if (existingUser != null)
            {
                throw new Exception("Email already in use");
            }

            // הצפנת הסיסמה
            var hashedPassword = _passwordHasher.HashPassword(null, registerUserDto.PasswordHash);  // הצפנה של הסיסמה

            var newUser = new User
            {
                Username = registerUserDto.Username,
                PasswordHash = hashedPassword,  // שמירה של הסיסמה המוצפנת ב-DB
                Role = registerUserDto.Role,
                Company =registerUserDto.Company,
                Email = registerUserDto.Email,
                CreatedAt = DateTime.UtcNow
            };

            await _authRepository.CreateUserAsync(newUser);

            return GenerateJwtToken(newUser.Username, newUser.Role, newUser.Company);
        }

        private string GenerateJwtToken(string userName, string role, string company)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),   
                new Claim(ClaimTypes.Role, role),
                new Claim("company", company),          
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
