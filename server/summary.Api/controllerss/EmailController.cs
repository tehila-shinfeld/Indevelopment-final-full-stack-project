using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using summary.Service;

namespace summary.Api.controllerss
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-with-attachment")]
        public async Task<IActionResult> SendWithAttachment([FromForm] EmailWithAttachmentRequest request)
        {
            try
            {
                await _emailService.SendEmailWithAttachmentAsync(request);
                return Ok("Email sent successfully.");
            }
            catch (Exception ex)
            {
                // לוג שגיאה אם יש
                return StatusCode(500, $"Failed to send email: {ex.Message}");
            }
        }
    }

}
