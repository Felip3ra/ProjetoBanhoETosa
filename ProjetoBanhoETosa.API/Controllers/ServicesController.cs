using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Infrastructure.Context;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("/api/[controller]")]
    public class ServicesController : Controller
    {
        private readonly AppDbContext _context;
        public ServicesController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("/GetAllServices")]
        public IActionResult GetAllServices() {
            List<Service> services = _context.Services.ToList();
            if (services == null || services.Count == 0)
            {
                return NotFound(new { message = "Servicos não Encontrados" });
            }
            return Ok(new { message = "Servicos Encontrados", Service = services });
        }

        [HttpPut("/UpdateService/{id}")]
        public IActionResult UpdateService(int id,[FromBody] Service service) {
            if (service == null || service.Price <= 0)
                return BadRequest(new { message = "Preço inválido." });

            var existe = _context.Services.FirstOrDefault(s => s.Id == id);
            if (existe == null)
                return NotFound(new { message = "Serviço não encontrado." });

            existe.Price = service.Price;
            _context.Entry(existe).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(new { message = "Preço atualizado com sucesso!", Service = existe });
        }
    }
}
