using AutoMapper;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Infrastructure.Mappings
{
    public class ServiceDTOMappingProfile : Profile
    {
        public ServiceDTOMappingProfile()
        {
            CreateMap<Service, ServiceDTO>().ReverseMap();
        }
    }
}
