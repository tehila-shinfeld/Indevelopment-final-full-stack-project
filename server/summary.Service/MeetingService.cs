using summary.Core.Entities;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using summary.Core.DTOs;
using summary.Core.IServices;
using summary.Core.IRepositories;

namespace summary.Service
{
    public class MeetingService : IMeetingService
    {
        private readonly IMeetingRepository meetingRepository;
        private readonly IRepositoryManager repositoryManager;
        private readonly IMapper mapper;

        public MeetingService(IMeetingRepository meetingRepository, IRepositoryManager repositoryManager, IMapper mapper)
        {
            this.meetingRepository = meetingRepository;
            this.repositoryManager = repositoryManager;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<MeetingDto>> GetAllAsyc()
        {
            var meetings = await Task.Run(() => meetingRepository.GetAllMeetings());
            var meetingDtos = mapper.Map<IEnumerable<MeetingDto>>(meetings);
            return meetingDtos;
        }

        public async Task<MeetingDto> GetByIdAsync(int id)
        {
            var meeting = meetingRepository.GetMeetingById(id);
            var meetingDto = mapper.Map<MeetingDto>(meeting);
            return meetingDto;
        }

        public async Task AddAsync(MeetingDto meetingDto)
        {
            var meeting = mapper.Map<Meeting>(meetingDto);
            meetingRepository.AddMeeting(meeting);
            await repositoryManager.SaveAsync();
        }

        public async Task<MeetingDto> ChangeAsync(int id, MeetingDto meetingDto)
        {
            var meeting = mapper.Map<Meeting>(meetingDto);
            var updatedMeeting = meetingRepository.ChangeMeeting(id, meeting);
            var updatedMeetingDto = mapper.Map<MeetingDto>(updatedMeeting);
            await repositoryManager.SaveAsync();
            return updatedMeetingDto;
        }

        public async Task<MeetingDto> DelAsync(int id)
        {
            var deletedMeeting = meetingRepository.Delete(id);
            var deletedMeetingDto = mapper.Map<MeetingDto>(deletedMeeting);
            await repositoryManager.SaveAsync();
            return deletedMeetingDto;
        }
    }
}
