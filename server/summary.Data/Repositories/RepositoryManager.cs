using summary.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace summary.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _dataContext;

        public IMeetingRepository MeetingRepository { get; }
        public IUserRepository UserRepository { get; }


        //private IUserRepository _userRepository;

        public RepositoryManager(DataContext dataContext,IMeetingRepository meetingRepository, IUserRepository userRepository)
        {
            _dataContext = dataContext;
            MeetingRepository = meetingRepository;
            UserRepository=userRepository;
        }

        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
