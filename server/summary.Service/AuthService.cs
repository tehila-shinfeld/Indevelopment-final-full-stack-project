using summary.Core.IRepositories;
using summary.Core.IServices;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using summary.Core.DTOs;
using summary.Core.Entities;
using System.Security.Cryptography;
namespace summary.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _configuration = configuration;
        }

        public async Task<string> AuthenticateUserAsync(string name, string password)
        {
            var user = await _authRepository.GetUserByNameAndPasswordAsync(name, password);
            if (user == null)
            {
                return null;
            }

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role) // שמירת תפקיד המשתמש
        };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: signinCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        public async Task<string> RegisterUserAsync(UserDto registerUserDto)
        {
            // בדיקה אם המשתמש כבר קיים
            var existingUser = await _authRepository.GetUserByNameAndPasswordAsync(registerUserDto.Username,registerUserDto.PasswordHash);
            if (existingUser != null)
            {
                throw new Exception("Email already in use");
            }

            // הצפנת הסיסמה
            string hashedPassword = HashPassword(registerUserDto.PasswordHash);

            // יצירת אובייקט משתמש חדש
            var newUser = new User
            {
                Email = registerUserDto.Email,
                PasswordHash = hashedPassword,
                Username = registerUserDto.Username,
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            await _authRepository.CreateUserAsync(newUser);

            // יצירת טוקן והחזרתו
            return GenerateJwtToken(newUser);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: signinCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }
}
