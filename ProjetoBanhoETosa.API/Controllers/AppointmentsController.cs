using Microsoft.AspNetCore.Mvc;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Infrastructure.Context;
using ProjetoBanhoETosa.Presentation.DTO;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("/api/[controller]")]
    public class AppointmentsController : Controller
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("/GetAllAppointments")]
        public IActionResult GetAllAppointments()
        {
            List<Appointment> appointments = _context.Appointments.ToList();
            if (appointments == null || appointments.Count == 0)
            {
                return NotFound(new { message = "No appointments found" });
            }
            return Ok(new { message = "No appointments found", Appointment = appointments });
        }
        [HttpPost("/NewAppointment")]
        public IActionResult NewAppointment([FromBody] AppointmentDTO appointmentDTO)
        {
            if (appointmentDTO == null)
            {
                return BadRequest(new { message = "The form has not filled correctly" });
            }
            Appointment newAppointment = new Appointment
            {
                PetName = appointmentDTO.PetName,
                OwnerName = appointmentDTO.OwnerName,
                Phone = appointmentDTO.Phone,
                Price = appointmentDTO.Price,
                ServiceId = appointmentDTO.ServiceId,
                AppointmentDate = appointmentDTO.AppointmentDate,
                AppointmentTime = appointmentDTO.AppointmentTime,
                PaymentMethod = appointmentDTO.PaymentMethod,
                PaymentStatus = appointmentDTO.PaymentStatus,
                HasSubscription = appointmentDTO.HasSubscription,
                SubscriptionId = appointmentDTO.SubscriptionId,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            _context.Appointments.Add(newAppointment);
            _context.SaveChanges();
            return Ok(new { message = "The Appointment Has been created sucessfuly", appointment = appointmentDTO });
        }
        [HttpDelete("/DeleteAppointment/{id}")]
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
        //[HttpPut("/UpdateAppointment/{id}")]
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
