using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core.IRepositories
{
    public interface IRepositoryManager
    {
        IMeetingRepository MeetingRepository { get; }
        IUserRepository UserRepository { get; }

        //IUserRepository UserRepository { get; }

        public Task SaveAsync();
    }
}
