using Microsoft.AspNetCore.Mvc;
using summary.Api;
using summary.Core.DTOs;
using summary.Core.IServices;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
    {
        Console.WriteLine("loginModel");

        Console.WriteLine($"Email: {loginModel.username}, Password: {loginModel.password}");
        var user = await _authService.AuthenticateUserAsync(loginModel.username, loginModel.password);
        if (user == null)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(new { Token = user.Token, Username = user.Username, UserId = user.Id });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto registerUserDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var user = await _authService.RegisterUserAsync(registerUserDto);
            return Ok(new { Token = user.Token, Username = user.Username, UserId = user.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}


