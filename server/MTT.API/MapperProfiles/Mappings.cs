using AutoMapper;
using MTT.Core.Models;

namespace MTT.API.MapperProfiles;

public class Mappings : Profile
{
    public Mappings()
    {
        //ignore non matching members
        CreateMap<User, UserDto>();
        CreateMap<UserDto, User>();
    }
}