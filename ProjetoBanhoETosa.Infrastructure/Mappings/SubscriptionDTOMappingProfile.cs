using AutoMapper;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Infrastructure.Mappings
{
    public class SubscriptionDTOMappingProfile : Profile
    {
        public SubscriptionDTOMappingProfile()
        {
            CreateMap<Subscription, SubscriptionDTO>().ReverseMap();
        }
    }
}
