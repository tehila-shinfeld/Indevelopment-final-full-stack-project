using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using summary.Core;
using summary.Core.Entities;
using summary.Core.IRepositories;
using summary.Core.IServices;

namespace summary.Service
{
    public class FileService : IFileService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IMeetingRepository _meetingRepository;
        private readonly IConfiguration _configuration;

        public FileService(IAmazonS3 s3Client, IMeetingRepository meetingRepository, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _meetingRepository = meetingRepository;
            _configuration = configuration;
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
        public async Task<string> GetSummaryFromAIAsync(string fileUrl)
        {
            Console.WriteLine("sersers");
            //var requestBody = new
            //{
            //    url = fileUrl
            //};

            //var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

            //var response = await _httpClient.PostAsync("https://api.openai.com/v1/summarize", content);

            //if (!response.IsSuccessStatusCode)
            //{
            //    throw new Exception("Failed to get summary from AI");
            //}

            //var responseContent = await response.Content.ReadAsStringAsync();
            //var aiSummary = JsonConvert.DeserializeObject<dynamic>(responseContent)?.summary;

            //return aiSummary?.ToString() ?? "No summary available.";
            var summary = "No summary available.";
            return summary;
        }

        public async Task<bool> SaveFileSummaryAsync(FileSummaryDto summary)
        {

            await _meetingRepository.SaveSummaryToDbAsync(summary);
            return true;
        }
    }


}

