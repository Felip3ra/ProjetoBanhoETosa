using Microsoft.AspNetCore.Mvc;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class PetsController : Controller
    {
        private readonly IService<PetDTO, Pet> _petService;

        public PetsController(IService<PetDTO, Pet> petService)
        {
            _petService = petService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pets = await _petService.GetAllAsync();
            if (pets == null || !pets.Any())
                return NotFound(new { message = "Nenhum pet encontrado" });

            return Ok(pets);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pet = await _petService.GetByIdAsync(id);
            return pet == null
                ? NotFound(new { message = "Pet nao encontrado" })
                : Ok(pet);
        }

        [HttpGet("ByClient/{clientId:int}")]
        public async Task<IActionResult> GetByClient(int clientId)
        {
            var pets = await _petService.GetAllAsync();
            var clientPets = pets?.Where(p => p.ClientId == clientId).ToList();
            if (clientPets == null || !clientPets.Any())
                return NotFound(new { message = "Nenhum pet encontrado para este cliente" });

            return Ok(clientPets);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PetDTO pet)
        {
            if (pet == null || string.IsNullOrWhiteSpace(pet.Name) || string.IsNullOrWhiteSpace(pet.Species) || pet.ClientId <= 0)
                return BadRequest(new { message = "Dados do pet invalidos" });

            var created = await _petService.AddAsync(pet);
            if (!created)
                return StatusCode(500, new { message = "Erro ao criar pet" });

            var saved = await _petService.GetByCondition(p =>
                p.Name == pet.Name &&
                p.ClientId == pet.ClientId &&
                p.Species == pet.Species);

            return CreatedAtAction(nameof(GetById), new { id = saved?.Id ?? pet.Id }, saved ?? pet);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] PetDTO pet)
        {
            var existing = await _petService.GetByIdAsync(id);
            if (existing == null)
                return NotFound(new { message = "Pet nao encontrado" });

            existing.Name = string.IsNullOrWhiteSpace(pet.Name) ? existing.Name : pet.Name;
            existing.Species = string.IsNullOrWhiteSpace(pet.Species) ? existing.Species : pet.Species;
            existing.Breed = pet.Breed ?? existing.Breed;
            existing.Age = pet.Age ?? existing.Age;
            existing.Notes = pet.Notes ?? existing.Notes;
            existing.PlanId = pet.PlanId ?? existing.PlanId;
            existing.ClientId = pet.ClientId > 0 ? pet.ClientId : existing.ClientId;

            var updated = await _petService.UpdateAsync(existing);
            if (!updated)
                return StatusCode(500, new { message = "Erro ao atualizar pet" });

            return Ok(existing);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _petService.DeleteAsync(id);
            return deleted ? NoContent() : NotFound(new { message = "Pet nao encontrado" });
        }
    }
}
