using AutoMapper;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Infrastructure.Mappings
{
    public class PetDTOMappingProfile : Profile
    {
        public PetDTOMappingProfile()
        {
            CreateMap<Pet, PetDTO>().ReverseMap();
        }
    }
}
