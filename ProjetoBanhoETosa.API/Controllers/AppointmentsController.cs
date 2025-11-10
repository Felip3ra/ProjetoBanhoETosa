using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Infrastructure.Context;
using ProjetoBanhoETosa.Presentation.DTO;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class AppointmentsController : Controller
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("GetAllAppointments")]
        public IActionResult GetAllAppointments()
        {
            var appointments = _context.Appointments.ToList();

            if (appointments == null || appointments.Count == 0)
                return NotFound(new { message = "No appointments found" });

            // Mapeia entidade → DTO
            var dtoList = appointments.Select(a => new AppointmentDTO
            {
                Id = a.Id,
                PetName = a.PetName,
                OwnerName = a.OwnerName,
                Phone = a.Phone,
                ServiceName = a.Service?.Name ?? "Desconhecido",
                AppointmentDateString = a.AppointmentDate.ToString("yyyy-MM-dd"),
                AppointmentTimeString = a.AppointmentTime.ToString("HH:mm"),
                Price = a.Price,
                PaymentMethodString = a.PaymentMethod.ToString(),
                PaymentStatus = a.PaymentStatus,
                HasSubscription = a.HasSubscription,
                SubscriptionId = a.SubscriptionId
            }).ToList();

            return Ok(new
            {
                message = "Appointments retrieved successfully",
                appointments = dtoList
            });
        }

        [HttpPost("NewAppointment")]
        public IActionResult NewAppointment([FromBody] AppointmentDTO dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid JSON format" });

            // Converte tipos textuais vindos do front
            dto.AppointmentDate = DateTime.Parse(dto.AppointmentDateString);
            dto.AppointmentTime = TimeOnly.Parse(dto.AppointmentTimeString);

            if (!Enum.TryParse<PaymentMethod>(dto.PaymentMethodString, true, out var method))
                method = PaymentMethod.Pix;

            dto.PaymentMethod = method;

            // Exemplo: se tiver tabela Service
            var service = _context.Services.FirstOrDefault(s => s.Name == dto.ServiceName);
            dto.ServiceId = service?.Id ?? 1;

            var appointment = new Appointment
            {
                PetName = dto.PetName,
                OwnerName = dto.OwnerName,
                Phone = dto.Phone,
                ServiceId = dto.ServiceId,
                AppointmentDate = dto.AppointmentDate,
                AppointmentTime = dto.AppointmentTime,
                Price = dto.Price,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = PaymentStatus.Pendente,
                HasSubscription = false,
                SubscriptionId = null,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Appointments.Add(appointment);
            _context.SaveChanges();

            return Ok(new { message = "Appointment created successfully", appointment });
        }

        [HttpDelete("DeleteAppointment/{id}")]
        public IActionResult DeleteAppointment(int id)
        {
            if (id == 0 || id == null)
            {
                return NotFound(new { message = "The Id cannot be zero or null" });
            }
            Appointment appointment = _context.Appointments.FirstOrDefault(x => x.Id == id);
            _context.Appointments.Remove(appointment);
            _context.SaveChanges();
            return NoContent();
        }
        //[HttpPut("UpdateAppointment/{id}")]
        //public IActionResult UpdateAppointment(int id)
        //{
        //    if (id == 0 || id == null)
        //    {
        //        return NotFound(new { message = "The Id cannot be zero or null" });
        //    }
        //    Appointment appointment = _context.Appointments.FirstOrDefault(x => x.Id == id);
        //    if (appointment == null)
        //    {
        //        return NotFound(new { message = "Appointment not found" });
        //    }
        //    appointment.PetName = appointment.PetName;
        //    appointment.OwnerName = appointment.OwnerName;
        //    appointment.Phone = appointment.Phone;
        //    appointment.Price = appointment.Price;
        //    appointment.ServiceId = appointment.ServiceId;
        //    appointment.AppointmentDate = appointment.AppointmentDate;
        //    appointment.AppointmentTime = appointment.AppointmentTime;
        //    appointment.PaymentMethod = appointment.PaymentMethod;
        //    appointment.PaymentStatus = appointment.PaymentStatus;
        //    appointment.HasSubscription = appointment.HasSubscription;
        //    appointment.SubscriptionId = appointment.SubscriptionId;
        //    appointment.UpdatedAt = DateTime.Now;
        //    _context.Appointments.Update(appointment);
        //    _context.SaveChanges();
        //    return Ok(new { message = "The Appointment Has been updated sucessfuly", appointment = appointmentDTO });
        //}
    }
}
