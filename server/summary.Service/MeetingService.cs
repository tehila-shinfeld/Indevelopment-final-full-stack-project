using summary.Core.Entities;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using summary.Core.DTOs;
using summary.Core.IServices;
using summary.Core.IRepositories;
using summary.Data.Repositories;

namespace summary.Service
{
    public class MeetingService : IMeetingService
    {
        private readonly IMeetingRepository _meetingRepository;
        private readonly IRepositoryManager repositoryManager;
        private readonly IMapper mapper;

        public MeetingService(IMeetingRepository meetingRepository, IRepositoryManager repositoryManager, IMapper mapper)
        {
            this._meetingRepository = meetingRepository;
            this.repositoryManager = repositoryManager;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<MeetingDto>> GetAllAsyc()
        {
            var meetings = await Task.Run(() => _meetingRepository.GetAllMeetings());
            var meetingDtos = mapper.Map<IEnumerable<MeetingDto>>(meetings);
            return meetingDtos;
        }

        public async Task<MeetingDto> GetByIdAsync(int id)
        {
            var meeting = _meetingRepository.GetMeetingById(id);
            var meetingDto = mapper.Map<MeetingDto>(meeting);
            return meetingDto;
        }

        public async Task AddAsync(MeetingDto meetingDto)
        {
            var meeting = mapper.Map<Meeting>(meetingDto);
            _meetingRepository.AddMeeting(meeting);
            await repositoryManager.SaveAsync();
        }

        public async Task<MeetingDto> ChangeAsync(int id, MeetingDto meetingDto)
        {
            var meeting = mapper.Map<Meeting>(meetingDto);
            var updatedMeeting = _meetingRepository.ChangeMeeting(id, meeting);
            var updatedMeetingDto = mapper.Map<MeetingDto>(updatedMeeting);
            await repositoryManager.SaveAsync();
            return updatedMeetingDto;
        }

        public async Task<MeetingDto> DelAsync(int id)
        {
            var deletedMeeting = _meetingRepository.Delete(id);
            var deletedMeetingDto = mapper.Map<MeetingDto>(deletedMeeting);
            await repositoryManager.SaveAsync();
            return deletedMeetingDto;
        }

        public async Task<bool> RemoveUserFromMeetingAsync(int meetingId, int userId)
        {
            var meeting = await _meetingRepository.GetMeetingWithUsersAsync(meetingId);
            if (meeting == null)
                return false;

            var userToRemove = meeting.Users.FirstOrDefault(u => u.Id == userId);
            if (userToRemove == null)
                return false;

            meeting.Users.Remove(userToRemove);
            await _meetingRepository.UpdateAsync(meeting);
            return true;
        }
    }
}
