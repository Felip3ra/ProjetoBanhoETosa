using AutoMapper;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Infrastructure.Mappings
{
    public class ClientDTOMappingProfile : Profile
    {
        public ClientDTOMappingProfile()
        {
            CreateMap<Client, ClientDTO>().ReverseMap();
        }
    }
}
