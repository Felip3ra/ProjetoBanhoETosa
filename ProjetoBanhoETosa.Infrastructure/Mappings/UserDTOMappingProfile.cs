using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Application.DTO;


namespace ProjetoBanhoETosa.Infrastructure.Mappings
{
    public class UserDTOMappingProfile : Profile
    {
        public UserDTOMappingProfile()
        {
            //Mapeamento de User para UserDTO
            CreateMap<User, UserDTO>().ReverseMap();
                
        }
    }
}
