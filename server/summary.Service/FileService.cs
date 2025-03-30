using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using summary.Core;
using summary.Core.DTOs;
using summary.Core.Entities;
using summary.Core.IRepositories;
using summary.Core.IServices;
using summary.Data.Repositories;

namespace summary.Service
{
    public class FileService : IFileService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IMeetingRepository _meetingRepository;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IRepositoryManager _repositoryManager;

        public FileService(IAmazonS3 s3Client, IMeetingRepository meetingRepository, IConfiguration configuration ,IUserRepository userRepository)
        {
            _s3Client = s3Client;
            _meetingRepository = meetingRepository;
            _configuration = configuration;
            _userRepository = userRepository;
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
            var summary = "סיכום ישיבת צוות - פיתוח תוכנה\r\n📅 29 במרץ 2025 | 👥 משתתפים: דוד, שרון, אילן, מיכל, רוני\r\n\r\nעיקרי הישיבה:\r\nסטטוס פיתוח: הושלמו 80% מהמשימות לספרינט.\r\n\r\nאתגרים: בעיה בסנכרון מיקרו-שירותים – אילן יבדוק פתרון עם Redis.\r\n\r\nמשימות:\r\n\r\nשרון – סיום התחברות דרך Google.\r\n\r\nמיכל ורוני – סקירת קוד.\r\n\r\nדוד – בדיקות עומס.\r\n\r\nהחלטות:\r\n✅ הדגמת גרסה ראשונית ב-3 באפריל.\r\n✅ ישיבת מעקב ב-1 באפריל.\r\n✅ שיפור תיעוד והוספת בדיקות יחידה.\r\n\r\n⏳ סיום הישיבה: 11:30 🚀";
            summary+="סיכום ישיבת צוות - פיתוח תוכנה\r\n📅 29 במרץ 2025 | 👥 משתתפים: דוד, שרון, אילן, מיכל, רוני\r\n\r\nעיקרי הישיבה:\r\nסטטוס פיתוח: הושלמו 80% מהמשימות לספרינט.\r\n\r\nאתגרים: בעיה בסנכרון מיקרו-שירותים – אילן יבדוק פתרון עם Redis.\r\n\r\nמשימות:\r\n\r\nשרון – סיום התחברות דרך Google.\r\n\r\nמיכל ורוני – סקירת קוד.\r\n\r\nדוד – בדיקות עומס.\r\n\r\nהחלטות:\r\n✅ הדגמת גרסה ראשונית ב-3";
            var meeting = await _meetingRepository.GetMeetingByUrlAsync(fileUrl);
            if (meeting == null)
            {
                throw new InvalidOperationException($"Meeting not found for fileUrl: {fileUrl}");
            }

            meeting.SummaryContent = summary;
            await _meetingRepository.UpdateMeetingAsync(meeting);

            return summary;
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

