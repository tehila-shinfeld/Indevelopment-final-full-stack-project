using summary.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.IRepositories
{
    public interface IMeetingRepository
    {
        public IEnumerable<Meeting> GetAllMeetings();
        public Meeting GetMeetingById(int id);
        public void AddMeeting(Meeting meeting);
        public Meeting ChangeMeeting(int id, Meeting meeting);
        public Meeting Delete(int id);

        //========================================================================

        public Task AddMeetingAsync(Meeting meeting);
        public  Task<Meeting> GetMeetingByIdAsync(int meetingId);
        public Task UpdateMeetingAsync(Meeting meeting);
        public  Task SaveSummaryToDbAsync(FileSummaryDto summary);

    }
}
