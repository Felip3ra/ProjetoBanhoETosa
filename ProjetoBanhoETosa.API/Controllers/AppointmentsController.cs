using Microsoft.AspNetCore.Mvc;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class AppointmentsController : Controller
    {
        private readonly IService<AppointmentDTO, Appointment> _appointmentService;
        private readonly IService<ServiceDTO, Service> _serviceService;
        private readonly IService<PetDTO, Pet> _petService;

        public AppointmentsController(
            IService<AppointmentDTO, Appointment> appointmentService,
            IService<ServiceDTO, Service> serviceService,
            IService<PetDTO, Pet> petService)
        {
            _appointmentService = appointmentService;
            _serviceService = serviceService;
            _petService = petService;
        }

        [HttpGet("GetAllAppointments")]
        public async Task<IActionResult> GetAllAppointments()
        {
            IEnumerable<AppointmentDTO>? appointmentsDTO = await _appointmentService.GetAllAsync();

            return Ok(new
            {
                message = "Appointments retrieved successfully",
                appointments = appointmentsDTO ?? Enumerable.Empty<AppointmentDTO>()
            });
        }

        [HttpPost("NewAppointment")]
        public async Task<IActionResult> NewAppointment([FromBody] AppointmentDTO dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid JSON format" });

            if (!DateTime.TryParse(dto.AppointmentDateString, out var appointmentDate))
                return BadRequest(new { message = "Invalid appointment date" });

            if (!TimeOnly.TryParse(dto.AppointmentTimeString, out var appointmentTime))
                return BadRequest(new { message = "Invalid appointment time" });

            // Postgres exige DateTime em UTC para timestamp with time zone
            dto.AppointmentDate = DateTime.SpecifyKind(appointmentDate, DateTimeKind.Utc);
            dto.AppointmentTime = appointmentTime;

            if (!Enum.TryParse<PaymentMethod>(dto.PaymentMethodString, true, out var method))
                method = PaymentMethod.Pix;

            dto.PaymentMethod = method;

            var service = !string.IsNullOrWhiteSpace(dto.ServiceName)
                ? await _serviceService.GetByCondition(x => x.Name == dto.ServiceName)
                : null;
            dto.ServiceId = service?.Id ?? (dto.ServiceId == 0 ? 1 : dto.ServiceId);

            // Se vier petId, tenta preencher os dados do pet para consistência
            if (dto.PetId.HasValue)
            {
                var pet = await _petService.GetByIdAsync(dto.PetId.Value);
                if (pet != null && string.IsNullOrWhiteSpace(dto.PetName))
                {
                    dto.PetName = pet.Name;
                }
            }

            var created = await _appointmentService.AddAsync(dto);
            if (!created)
                return StatusCode(500, new { message = "Error creating appointment" });

            var saved = await _appointmentService.GetByCondition(a =>
                a.Phone == dto.Phone &&
                a.AppointmentDate == dto.AppointmentDate &&
                a.AppointmentTime == dto.AppointmentTime);

            return Ok(new { message = "Appointment created successfully", appointment = saved ?? dto });
        }

        [HttpDelete("DeleteAppointment/{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            if (id <= 0)
            {
                return NotFound(new { message = "The Id cannot be zero or null" });
            }
            
            bool deleted = await _appointmentService.DeleteAsync(id);
            if(!deleted)
            {
                return NotFound(new { message = "Appointment not found" });
            }
            return NoContent();
        }
    }
}
