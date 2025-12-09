using Microsoft.AspNetCore.Mvc;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Application.DTO;
using System;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class ClientsController : Controller
    {
        private readonly IClientAppService _clientAppService;

        public ClientsController(IClientAppService clientAppService)
        {
            _clientAppService = clientAppService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clients = await _clientAppService.GetAllAsync();
            if (clients == null || !clients.Any())
                return NotFound(new { message = "Nenhum cliente encontrado" });

            return Ok(clients);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var client = await _clientAppService.GetByIdAsync(id);
            if (client == null)
                return NotFound(new { message = "Cliente nao encontrado" });

            return Ok(client);
        }

        [HttpGet("GetSummary")]
        public async Task<IActionResult> GetSummary()
        {
            var (totalClients, totalPets) = await _clientAppService.GetSummaryAsync();
            return Ok(new { totalClients, totalPets });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClientDTO client)
        {
            if (client == null || string.IsNullOrWhiteSpace(client.Name) || string.IsNullOrWhiteSpace(client.Phone))
                return BadRequest(new { message = "Dados do cliente invalidos" });

            var createdId = await _clientAppService.CreateAsync(client);
            if (createdId <= 0)
                return StatusCode(500, new { message = "Erro ao criar cliente" });

            return CreatedAtAction(nameof(GetById), new { id = createdId }, new { id = createdId, client.Name, client.Phone, client.Email, client.PetName, client.PetSpecies });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ClientDTO client)
        {
            var updated = await _clientAppService.UpdateAsync(id, client);
            if (!updated)
                return NotFound(new { message = "Cliente nao encontrado" });

            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _clientAppService.DeleteAsync(id);
            return deleted ? NoContent() : NotFound(new { message = "Cliente nao encontrado" });
        }
    }
}
