using System.Threading.Tasks;
using summary.Core.DTOs;
using summary.Core.Entities;
using summary.Core.IRepositories;

namespace summary.Core.IServices
{
    public interface IFileService
    {
        public Task<FileUploadResponseDto> GeneratePresignedUrlAsync(string fileName, string fileType,DateTime meetingDate);

        public Task<FileDetailsDto?> GetFileByIdAsync(int fileId);

        public Task<bool> DeleteFileAsync(int fileId);

        public  Task<string> GetSummaryFromAIAsync(string fileUrl);

        public  Task<bool> SaveFileSummaryAsync(FileSummaryDto summary);

        public Task<bool> AssignFileToCustomersAsync(string fileUrl, List<int> customerIds);

        public Task<List<MeetingDto>?> GetUserMeetingsAsync(int userId);


    }
}
