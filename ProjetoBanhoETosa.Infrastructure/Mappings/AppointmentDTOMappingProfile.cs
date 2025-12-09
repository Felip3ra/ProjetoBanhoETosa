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
        public AppointmentDTOMappingProfile() {

            CreateMap<Appointment, AppointmentDTO>().ReverseMap();
        }
    }
}
