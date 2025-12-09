using Microsoft.AspNetCore.Mvc;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class ServicesController : Controller
    {
        private readonly IService<ServiceDTO, Service> _serviceService;

        public ServicesController(IService<ServiceDTO, Service> serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet("GetAllServices")]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _serviceService.GetAllAsync();
            var list = services?.ToList() ?? new List<ServiceDTO>();
            return Ok(new { message = "Servicos encontrados", Services = list });
        }

        [HttpPut("UpdateService/{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] decimal newPrice)
        {
            if (newPrice <= 0)
                return BadRequest(new { message = "Preco invalido." });

            var existingService = await _serviceService.GetByIdAsync(id);
            if (existingService == null)
                return NotFound(new { message = "Servico nao encontrado." });

            existingService.Price = newPrice;
            var updated = await _serviceService.UpdateAsync(existingService);
            if (!updated)
                return StatusCode(500, new { message = "Erro ao atualizar o preco do servico." });

            return Ok(new
            {
                message = "Preco atualizado com sucesso!",
                service = existingService
            });
        }

        [HttpPost("CreateService")]
        public async Task<IActionResult> CreateService([FromBody] ServiceDTO service)
        {
            if (service == null || string.IsNullOrWhiteSpace(service.Name) || service.Price <= 0 || service.DurationInMinutes <= 0)
                return BadRequest(new { message = "Dados do servico invalidos." });

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

        [HttpDelete("DeleteService/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Id invalido." });

            var deleted = await _serviceService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { message = "Servico nao encontrado." });

            return NoContent();
        }
    }
}
