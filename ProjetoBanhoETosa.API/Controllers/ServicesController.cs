using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Infrastructure.Context;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class ServicesController : Controller
    {
        private readonly AppDbContext _context;
        public ServicesController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("GetAllServices")]
        public IActionResult GetAllServices() {
            List<Service> services = _context.Services.ToList();
            if (services == null || services.Count == 0)
            {
                return NotFound(new { message = "Servicos não Encontrados" });
            }
            return Ok(new { message = "Servicos Encontrados", Services = services });
        }

        [HttpPut("UpdateService/{id}")]
        public IActionResult UpdateService(int id, [FromBody] decimal newPrice)
        {
            if (newPrice <= 0)
                return BadRequest(new { message = "Preço inválido." });

            var newService = _context.Services.FirstOrDefault(s => s.Id == id);
            if (newService == null)
                return NotFound(new { message = "Serviço não encontrado." });

            newService.Price = newPrice;
            _context.Services.Update(newService);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Preço atualizado com sucesso!",
                service = newService
            });
        }
    }
}
