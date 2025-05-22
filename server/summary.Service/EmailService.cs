using Microsoft.Extensions.Configuration;
using summary.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace summary.Service
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public EmailService(IConfiguration config, HttpClient httpClient)
        {
            _config = config;
            _httpClient = httpClient;
        }

        public async Task SendEmailWithAttachmentAsync(EmailWithAttachmentRequest request)
        {
            await using var memoryStream = new MemoryStream();
            await request.Attachment.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();
            var fileBase64 = Convert.ToBase64String(fileBytes);

            var payload = new
            {
                from = "TalkToMe.AI <onboarding@resend.dev>", // שימי דגש על אימות הדומיין
                to = new[] { request.Email },
                subject = request.Subject,
                html = $"<p>{request.Message}</p>",
                attachments = new[]
                {
                new {
                    filename = request.Attachment.FileName,
                    content = fileBase64,
                    type = request.Attachment.ContentType
                }
            }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_config["Resend:ApiKey"]}");

            var response = await _httpClient.PostAsync("https://api.resend.com/emails", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Resend API Error: {error}");
            }
        }
    }

}
