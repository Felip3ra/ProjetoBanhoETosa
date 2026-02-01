using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Infrastructure.Context;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class ServicesController : Controller
    {
        private readonly IService<ServiceDTO, Service> _serviceService;
        private readonly AppDbContext _context;
        private readonly ILogger<ServicesController> _logger;
        private readonly IWebHostEnvironment _environment;

        public ServicesController(
            IService<ServiceDTO, Service> serviceService,
            AppDbContext context,
            ILogger<ServicesController> logger,
            IWebHostEnvironment environment)
        {
            _serviceService = serviceService;
            _context = context;
            _logger = logger;
            _environment = environment;
        }

        [HttpGet("GetAllServices")]
        public async Task<IActionResult> GetAllServices()
        {
            try
            {
                var services = await _serviceService.GetAllAsync();
                var list = services?.ToList() ?? new List<ServiceDTO>();
                return Ok(new { message = "Servicos encontrados", Services = list });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar servicos");
                return StatusCode(500, new
                {
                    message = "Erro ao carregar servicos.",
                    details = _environment.IsDevelopment() ? ex.InnerException?.Message ?? ex.Message : null
                });
            }
        }

        [HttpPut("UpdateService/{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] decimal newPrice)
        {
            if (newPrice <= 0)
                return BadRequest(new { message = "Preco invalido." });

            try
            {
                var existingService = await _context.Services.FindAsync(id);
                if (existingService == null)
                    return NotFound(new { message = "Servico nao encontrado." });

                existingService.Price = newPrice;
                existingService.updated_at = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Preco atualizado com sucesso!",
                    service = existingService
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar preco do servico {ServiceId}", id);
                return StatusCode(500, new
                {
                    message = "Erro ao atualizar o preco do servico.",
                    details = _environment.IsDevelopment() ? ex.InnerException?.Message ?? ex.Message : null
                });
            }
        }

        [HttpPost("CreateService")]
        public async Task<IActionResult> CreateService([FromBody] ServiceDTO service)
        {
            if (service == null || string.IsNullOrWhiteSpace(service.Name) || service.Price <= 0 || service.DurationInMinutes <= 0)
                return BadRequest(new { message = "Dados do servico invalidos." });

            try
            {
                var added = await _serviceService.AddAsync(service);
                if (!added)
                    return StatusCode(500, new { message = "Erro ao cadastrar o servico." });

                var created = await _serviceService.GetByCondition(s => s.Name == service.Name);

                return CreatedAtAction(nameof(GetAllServices), new { id = created?.Id ?? service.Id }, new
                {
                    message = "Servico cadastrado com sucesso!",
                    service = created ?? service
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao cadastrar servico");
                return StatusCode(500, new
                {
                    message = "Erro ao cadastrar o servico.",
                    details = _environment.IsDevelopment() ? ex.InnerException?.Message ?? ex.Message : null
                });
            }
        }

        [HttpDelete("DeleteService/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Id invalido." });

            try
            {
                var deleted = await _serviceService.DeleteAsync(id);
                if (!deleted)
                    return NotFound(new { message = "Servico nao encontrado." });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao deletar servico {ServiceId}", id);
                return StatusCode(500, new
                {
                    message = "Erro ao deletar o servico.",
                    details = _environment.IsDevelopment() ? ex.InnerException?.Message ?? ex.Message : null
                });
            }
        }
    }
}
