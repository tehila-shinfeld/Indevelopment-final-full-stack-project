using AutoMapper;
using summary.Core.DTOs;
using summary.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Core
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Meeting, MeetingDto>().ReverseMap();
            CreateMap<User,UserDto>().ReverseMap();
            CreateMap<User, UserId_Name>().ReverseMap();


        }
    }
}
