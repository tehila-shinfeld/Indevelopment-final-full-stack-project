using Microsoft.AspNetCore.Mvc;
using summary.Api;
using summary.Core.DTOs;
using summary.Core.IServices;

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
    public IActionResult Login([FromBody] LoginModel loginModel)
    {
        var token = _authService.AuthenticateUserAsync(loginModel.Username, loginModel.Password);
        if (token == null)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(new { Token = token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto registerUserDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var token = await _authService.RegisterUserAsync(registerUserDto);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}


