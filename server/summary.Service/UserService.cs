using summary.Core.Entities;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using summary.Core.DTOs;
using summary.Core.IRepositories;
using summary.Core.IServices;
using summary.Core;

namespace summary.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        private readonly IRepositoryManager repositoryManager;
        private readonly IMapper mapper;

        public UserService(IUserRepository userRepository, IRepositoryManager repositoryManager, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.repositoryManager = repositoryManager;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsyc()
        {
            var users = await Task.Run(() => userRepository.GetAllUsers());
            var userDtos = mapper.Map<IEnumerable<UserDto>>(users);
            return userDtos;
        }
        public async Task<IEnumerable<UserId_Name>> GetAllByCompanyAsyc(string company)
        {
            var users = await Task.Run(() => userRepository.GetAllByComp(company));
            var userDtos = mapper.Map<IEnumerable<UserId_Name>>(users);
            return userDtos;
        }
        public async Task<UserDto> GetByIdAsync(int id)
        {
            var user = userRepository.GetUserById(id);
            var userDto = mapper.Map<UserDto>(user);
            return userDto;
        }

        public async Task AddAsync(UserDto userDto)
        {
            var user = mapper.Map<User>(userDto);
            userRepository.AddUser(user);
            await repositoryManager.SaveAsync();
        }

        public async Task<UserDto> ChangeAsync(int id, UserDto userDto)
        {
            var user = mapper.Map<User>(userDto);
            var updatedUser = userRepository.ChangeUser(id, user);
            var updatedUserDto = mapper.Map<UserDto>(updatedUser);
            await repositoryManager.SaveAsync();
            return updatedUserDto;
        }

        public async Task<UserDto> DelAsync(int id)
        {
            var deletedUser = userRepository.Delete(id);
            var deletedUserDto = mapper.Map<UserDto>(deletedUser);
            await repositoryManager.SaveAsync();
            return deletedUserDto;
        }
    }
}
