using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using summary.Core.DTOs;
using summary.Core.IServices;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace summary.Api.controllerss
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingController : ControllerBase
    {
        private readonly IMeetingService meetingService;

        public MeetingController(IMeetingService meetingService)
        {
            this.meetingService = meetingService;
        }

        [HttpGet]
        public async Task<IEnumerable<MeetingDto>> Get()
        {
            return await meetingService.GetAllAsyc();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var meeting = await meetingService.GetByIdAsync(id);

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
                await meetingService.AddAsync(meetingDto);
                return Ok(meetingDto);
            }
            return BadRequest("Invalid meeting data");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MeetingDto meetingDto)
        {
            var updatedMeeting = await meetingService.ChangeAsync(id, meetingDto);
            if (updatedMeeting != null)
            {
                return Ok(updatedMeeting);
            }
            return NotFound(id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deletedMeeting = await meetingService.DelAsync(id);
            if (deletedMeeting != null)
            {
                return Ok(deletedMeeting);
            }
            return NotFound(id);
        }
    }
}
