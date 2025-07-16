using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using summary.Core;
using summary.Core.DTOs;
using summary.Core.IServices;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace summary.Api.controllerss
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<UserDto>> Get()
        {
            return await userService.GetAllAsyc();
        }

        [HttpGet("ByComp")]
        public async Task<IEnumerable<UserId_Name>> Get([FromQuery] string company)
        {
            return await userService.GetAllByCompanyAsyc(company);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var user = await userService.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound(id);
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] UserDto userDto)
        {
            if (userDto != null)
            {
                await userService.AddAsync(userDto);
                return Ok(userDto);
            }
            return BadRequest("Invalid user data");
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UserDto userDto)
        {
            var updatedUser = await userService.ChangeAsync(id, userDto);
            if (updatedUser != null)
            {
                return Ok(updatedUser);
            }
            return NotFound(id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deletedUser = await userService.DelAsync(id);
            if (deletedUser != null)
            {
                return Ok(deletedUser);
            }
            return NotFound(id);
        }
    }
}
