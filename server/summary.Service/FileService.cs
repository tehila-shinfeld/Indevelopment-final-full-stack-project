using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using summary.Core;
using summary.Core.DTOs;
using summary.Core.Entities;
using summary.Core.IRepositories;
using summary.Core.IServices;
using System.Net.Http.Headers;

namespace summary.Service
{
    public class FileService : IFileService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IMeetingRepository _meetingRepository;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IRepositoryManager _repositoryManager;
        private readonly HttpClient _httpClient;

        public FileService(IAmazonS3 s3Client, IMeetingRepository meetingRepository, IConfiguration configuration, IUserRepository userRepository, HttpClient httpClient)
        {
            _s3Client = s3Client;
            _meetingRepository = meetingRepository;
            _configuration = configuration;
            _userRepository = userRepository;
            _httpClient = httpClient;
        }

        public async Task<FileUploadResponseDto> GeneratePresignedUrlAsync(string fileName)
        {
            // יצירת ישיבה חדשה
            var meeting = new Meeting
            {
                Name = $"{fileName}",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _meetingRepository.AddMeetingAsync(meeting);

            // הגדרת שם הקובץ ב-S3
            string bucketName = _configuration["AWS:BucketName"];
            string fileKey = $"meetings/{meeting.Id}/{fileName}";

            // יצירת URL עם תוקף של 5 דקות
            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = fileKey,
                Expires = DateTime.UtcNow.AddMinutes(5),
                Verb = HttpVerb.PUT
            };

            string presignedUrl = _s3Client.GetPreSignedURL(request);

            // עדכון הלינק לענן
            meeting.TranscriptionLink = $"https://{bucketName}.s3.amazonaws.com/{fileKey}";
            await _meetingRepository.UpdateMeetingAsync(meeting);

            return new FileUploadResponseDto
            {
                FileId = meeting.Id,
                FileUrl = presignedUrl,
                S3Url=$"https://{bucketName}.s3.amazonaws.com/{fileKey}"
            };
        }
        public async Task<FileDetailsDto?> GetFileByIdAsync(int fileId)
        {
            var meeting = await _meetingRepository.GetMeetingByIdAsync(fileId);
            if (meeting == null) return null;

            return new FileDetailsDto
            {
                FileUrl = meeting.TranscriptionLink,
                UploadedBy = meeting.CreatedByUserId.ToString(),
                CreatedAt = meeting.CreatedAt
            };
        }
        public async Task<bool> DeleteFileAsync(int fileId)
        {
            var meeting = await _meetingRepository.GetMeetingByIdAsync(fileId);
            if (meeting == null) return false;

            string bucketName = _configuration["AWS:BucketName"];
            string fileKey = meeting.TranscriptionLink?.Replace($"https://{bucketName}.s3.amazonaws.com/", "");

            if (!string.IsNullOrEmpty(fileKey))
            {
                await _s3Client.DeleteObjectAsync(bucketName, fileKey);
            }

            //await _meetingRepository.Delete(Smeeting.Id);
            return true;
        }
        public async Task<string> GetSummaryFromAIAsync(string inputText)
        {
            //var apiKey = _configuration["OpenAI:ApiKey"];
            var apiKey = _configuration["OpenAI:ApiKey"];
            Console.WriteLine(apiKey);
            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new { role = "system", content = " אתה מסכם תמלולים של ישיבות צוות בצורה תמציתית, ברורה, ומסודרת. הסיכום חייב לכלול כותרת ראשית, חלוקה לפסקאות קצרות, שימוש ברשימות ממוספרות או בתבליטים לנקודות עיקריות, ושמירה על עימוד ברור." },

            new {
            role = "user",
            content =  $@"אתה עוזר חכם שמסכם ישיבות צוות בעברית בפורמט מסודר:
📅 תאריך הישיבה: 
👥 משתתפים: 
📝 עיקרי הדברים:
✅ החלטות שהתקבלו:
📌משימות להמשך, אם מתאים גם מחולק לכל מישתתף את המשימות עבורו  :
❓ נושאים פתוחים/להמשך טיפול:
הנה התמלול לסיכום:
{inputText}"
        }
    },
                temperature = 0.6
            };

            Console.WriteLine("API KEY: " + apiKey); // רק לבדיקה כמובן, לא להשאיר בקוד פרודקשן

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(requestBody), System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"❌ Error: {response.StatusCode} - {err}");
            }
            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync();
            using var doc = await System.Text.Json.JsonDocument.ParseAsync(stream);

            return doc.RootElement
                      .GetProperty("choices")[0]
                      .GetProperty("message")
                      .GetProperty("content")
                      .GetString()!;
        }
        public async Task<bool> SaveFileSummaryAsync(FileSummaryDto summary)
        {
            await _meetingRepository.SaveSummaryToDbAsync(summary);
            return true;
        }
        public async Task<bool> AssignFileToCustomersAsync(string fileUrl, List<int> customerIds)
        {
            var meeting = await _meetingRepository.GetMeetingByUrlAsync(fileUrl);

            if (meeting == null)
            {
                return false;
            }

            var customers = await _userRepository.GetUsersByIdsAsync(customerIds);

            if (!customers.Any())
            {
                return false;
            }

            foreach (var customer in customers)
            {
                if (!customer.Meetings.Contains(meeting))
                {
                    customer.Meetings.Add(meeting);
                }
            }

            await _meetingRepository.SaveAsync();
            return true;
        }
        public async Task<List<MeetingDto>?> GetUserMeetingsAsync(int userId)
        {
            var userExists = await _userRepository.UserExistsAsync(userId);
            if (!userExists) return null;

            var meetings = await _meetingRepository.GetMeetingsByUserIdAsync(userId);
            return meetings;
        }
    }
}

