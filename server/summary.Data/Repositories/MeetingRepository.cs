using Microsoft.EntityFrameworkCore;
using summary.Core;
using summary.Core.Entities;
using summary.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace summary.Data.Repositories
{
    public class MeetingRepository : IMeetingRepository
    {
        private readonly DataContext _dataContext;

        public MeetingRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public IEnumerable<Meeting> GetAllMeetings()
        {
            return _dataContext.Meetings.Include(m => m.Users);
//.Include(m => m.CreatedByUser);
        }

        public Meeting GetMeetingById(int id)
        {
            return _dataContext.Meetings.FirstOrDefault(m => m.Id == id);
        }

        public void AddMeeting(Meeting meeting)
        {
            _dataContext.Meetings.Add(meeting);
        }

        public Meeting ChangeMeeting(int id, Meeting meeting)
        {
            var existingMeeting = _dataContext.Meetings.FirstOrDefault(m => m.Id == id);
            if (existingMeeting != null)
            {
                existingMeeting.Name = meeting.Name;
                existingMeeting.TranscriptionLink = meeting.TranscriptionLink;
                existingMeeting.SummaryContent = meeting.SummaryContent;
                existingMeeting.UpdatedAt = DateTime.UtcNow;
                existingMeeting.Users = meeting.Users;
                return existingMeeting;
            }
            return null;
        }

        public Meeting Delete(int id)
        {
            var meeting = _dataContext.Meetings.FirstOrDefault(m => m.Id == id);
            if (meeting != null)
            {
                _dataContext.Meetings.Remove(meeting);
                return meeting;
            }
            return null;
        }
        //===============================================
        public async Task AddMeetingAsync(Meeting meeting)
        {
            await _dataContext.Meetings.AddAsync(meeting);
            await _dataContext.SaveChangesAsync();
        }

        public async Task<Meeting> GetMeetingByIdAsync(int meetingId)
        {
            return await _dataContext.Meetings.FindAsync(meetingId);
        }

        public async Task UpdateMeetingAsync(Meeting meeting)
        {
            _dataContext.Meetings.Update(meeting);
            await _dataContext.SaveChangesAsync();
        }

        public async Task DeleteMeetingAsync(int meetingId)
        {
            var meeting = await _dataContext.Meetings.FindAsync(meetingId);
            if (meeting != null)
            {
                _dataContext.Meetings.Remove(meeting);
                await _dataContext.SaveChangesAsync();
            }
        }

        public async Task SaveSummaryToDbAsync(FileSummaryDto summary)
        {
            var meeting = await _dataContext.Meetings.FirstOrDefaultAsync(m => m.TranscriptionLink == summary.FileUrl);

            if (meeting != null)
            {
                meeting.SummaryContent = summary.Summary;
                await _dataContext.SaveChangesAsync();
            }
        }
    }


}

