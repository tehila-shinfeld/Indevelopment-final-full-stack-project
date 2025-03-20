using summary.Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace summary.Core.IServices
{
    public interface IUserService
    {
        public Task<IEnumerable<UserDto>> GetAllAsyc();
        public Task<UserDto> GetByIdAsync(int id);
        public Task AddAsync(UserDto user);
        public Task<UserDto> ChangeAsync(int id, UserDto user);
        public Task<UserDto> DelAsync(int id);
    }
}