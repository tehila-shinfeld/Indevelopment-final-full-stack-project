using Microsoft.AspNetCore.Http;

namespace summary.Api
{
    public class EmailWithAttachmentRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public IFormFile Attachment { get; set; } = null!;
    }
}
