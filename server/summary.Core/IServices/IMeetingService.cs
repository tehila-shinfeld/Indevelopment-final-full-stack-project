using summary.Core.DTOs;
using summary.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.IServices
{
    public interface IMeetingService
    {
        public Task<IEnumerable<MeetingDto>> GetAllAsyc();
        public Task<MeetingDto> GetByIdAsync(int id);
        public Task AddAsync(MeetingDto meeting);
        public Task<MeetingDto> ChangeAsync(int id, MeetingDto meeting);
        public Task<MeetingDto> DelAsync(int id);
        public Task<bool> RemoveUserFromMeetingAsync(int meetingId, int userId);

    }
}
