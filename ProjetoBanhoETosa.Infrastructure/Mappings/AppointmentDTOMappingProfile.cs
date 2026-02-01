using AutoMapper;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Infrastructure.Mappings
{
    public class AppointmentDTOMappingProfile : Profile
    {
        public AppointmentDTOMappingProfile()
        {
            CreateMap<Appointment, AppointmentDTO>()
                .ForMember(dest => dest.AppointmentDateString,
                    opt => opt.MapFrom(src => src.AppointmentDate.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.AppointmentTimeString,
                    opt => opt.MapFrom(src => src.AppointmentTime.ToString("HH:mm")));

            CreateMap<AppointmentDTO, Appointment>()
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.Subscriptions, opt => opt.Ignore())
                .ForMember(dest => dest.Pet, opt => opt.Ignore());
        }
    }
}
