using Microsoft.AspNetCore.Hosting;
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
        private readonly IService<SubscriptionDTO, Subscription> _subscriptionService;
        private readonly IWebHostEnvironment _environment;

        public AppointmentsController(
            IService<AppointmentDTO, Appointment> appointmentService,
            IService<ServiceDTO, Service> serviceService,
            IService<PetDTO, Pet> petService,
            IService<SubscriptionDTO, Subscription> subscriptionService,
            IWebHostEnvironment environment)
        {
            _appointmentService = appointmentService;
            _serviceService = serviceService;
            _petService = petService;
            _subscriptionService = subscriptionService;
            _environment = environment;
        }

        [HttpGet("GetAllAppointments")]
        public async Task<IActionResult> GetAllAppointments()
        {
            try
            {
                IEnumerable<AppointmentDTO>? appointmentsDTO = await _appointmentService.GetAllAsync();
                var appointments = (appointmentsDTO ?? Enumerable.Empty<AppointmentDTO>())
                    .Select(a => new
                    {
                        id = a.Id,
                        petName = a.PetName,
                        owner = a.OwnerName,
                        service = a.ServiceName,
                        date = a.AppointmentDateString,
                        time = a.AppointmentTimeString,
                        phone = a.Phone,
                        price = a.Price,
                        paymentMethod = a.PaymentMethodString,
                        subscriptionId = a.SubscriptionId,
                        petId = a.PetId,
                        hasSubscription = a.HasSubscription
                    })
                    .ToList();

                return Ok(new
                {
                    message = "Appointments retrieved successfully",
                    appointments
                });
            }
            catch (Exception ex)
            {
                var details = _environment.IsDevelopment() ? ex.ToString() : null;
                return StatusCode(500, new { message = "Erro ao carregar agendamentos", details });
            }
        }

        [HttpPost("NewAppointment")]
        public async Task<IActionResult> NewAppointment([FromBody] AppointmentDTO dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid JSON format" });

            try
            {
                if (!DateTime.TryParse(dto.AppointmentDateString, out var appointmentDate))
                    return BadRequest(new { message = "Invalid appointment date" });

                if (!TimeOnly.TryParse(dto.AppointmentTimeString, out var appointmentTime))
                    return BadRequest(new { message = "Invalid appointment time" });

                // Postgres exige DateTime em UTC para timestamp with time zone
                dto.AppointmentDate = DateTime.SpecifyKind(appointmentDate, DateTimeKind.Utc);
                dto.AppointmentTime = appointmentTime;

                if (!Enum.TryParse<PaymentMethod>(dto.PaymentMethodString, true, out var method))
                {
                    method = dto.PaymentMethodString?.Contains("plano", StringComparison.OrdinalIgnoreCase) == true
                        ? PaymentMethod.Plano
                        : PaymentMethod.Pix;
                }

                dto.PaymentMethod = method;

                SubscriptionDTO? subscription = null;
                if (dto.SubscriptionId.HasValue)
                {
                    subscription = await _subscriptionService.GetByIdAsync(dto.SubscriptionId.Value);
                    if (subscription == null)
                        return NotFound(new { message = "Assinatura nao encontrada" });

                    var now = DateTime.UtcNow;
                    var isPaid = string.Equals(subscription.PaymentStatus, "pago", StringComparison.OrdinalIgnoreCase);

                    if (!isPaid)
                        return BadRequest(new { message = "Assinatura nao esta paga" });

                    if (subscription.EndDate < now)
                        return BadRequest(new { message = "Assinatura vencida" });

                    if (subscription.ServicesUsed >= subscription.ServicesAvailable)
                        return BadRequest(new { message = "Limite de servicos do plano atingido" });

                    dto.HasSubscription = true;
                }

                ServiceDTO? service = null;
                if (!string.IsNullOrWhiteSpace(dto.ServiceName))
                {
                    service = await _serviceService.GetByCondition(x => x.Name == dto.ServiceName);
                    if (service == null)
                        return BadRequest(new { message = "Servico nao encontrado" });
                    dto.ServiceId = service.Id;
                }
                else if (dto.ServiceId > 0)
                {
                    service = await _serviceService.GetByIdAsync(dto.ServiceId);
                    if (service == null)
                        return BadRequest(new { message = "Servico nao encontrado" });
                }
                else
                {
                    return BadRequest(new { message = "Servico invalido" });
                }

                // Se vier petId, tenta preencher os dados do pet para consistencia
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

                if (subscription != null)
                {
                    subscription.ServicesUsed += 1;
                    subscription.StartDate = DateTime.SpecifyKind(subscription.StartDate, DateTimeKind.Utc);
                    subscription.EndDate = DateTime.SpecifyKind(subscription.EndDate, DateTimeKind.Utc);

                    var updated = await _subscriptionService.UpdateAsync(subscription);
                    if (!updated)
                        return StatusCode(500, new { message = "Erro ao atualizar o uso da assinatura" });
                }

                return Ok(new { message = "Appointment created successfully", appointment = saved ?? dto });
            }
            catch (Exception ex)
            {
                var details = _environment.IsDevelopment() ? ex.ToString() : null;
                return StatusCode(500, new { message = "Erro ao adicionar agendamento", details });
            }
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
