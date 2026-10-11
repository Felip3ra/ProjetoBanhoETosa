using AutoMapper;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Infrastructure.Mappings
{
    public class PlanDTOMappingProfile : Profile
    {
        public PlanDTOMappingProfile()
        {
            CreateMap<Plan, PlanDTO>().ReverseMap();
        }
    }
}
