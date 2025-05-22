using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using summary.Core.DTOs;
using summary.Core.IServices;
using summary.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace summary.Api.controllerss
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingController : ControllerBase
    {
        private readonly IMeetingService _meetingService;

        public MeetingController(IMeetingService meetingService)
        {
            this._meetingService = meetingService;
        }

        [HttpGet]
        public async Task<IEnumerable<MeetingDto>> Get()
        {
            return await _meetingService.GetAllAsyc();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var meeting = await _meetingService.GetByIdAsync(id);

            if (meeting == null)
            {
                return NotFound(id);
            }
            return Ok(meeting);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MeetingDto meetingDto)
        {
            if (meetingDto != null)
            {
                await _meetingService.AddAsync(meetingDto);
                return Ok(meetingDto);
            }
            return BadRequest("Invalid meeting data");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MeetingDto meetingDto)
        {
            var updatedMeeting = await _meetingService.ChangeAsync(id, meetingDto);
            if (updatedMeeting != null)
            {
                return Ok(updatedMeeting);
            }
            return NotFound(id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deletedMeeting = await _meetingService.DelAsync(id);
            if (deletedMeeting != null)
            {
                return Ok(deletedMeeting);
            }
            return NotFound(id);
        }

        [HttpDelete("{meetingId}/User/{userId}")]
        public async Task<IActionResult> RemoveUserFromMeeting(int meetingId, int userId)
        {
            var success = await _meetingService.RemoveUserFromMeetingAsync(meetingId, userId);
            if (!success)
                return NotFound("User not in meeting or meeting not found.");

            return NoContent();
        }
    }
}