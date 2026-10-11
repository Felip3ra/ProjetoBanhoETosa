using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class PlansController : Controller
    {
        private readonly IService<PlanDTO, Plan> _planService;
        private readonly IWebHostEnvironment _environment;
        public PlansController(IService<PlanDTO, Plan> planService, IWebHostEnvironment environment)
        {
            _planService = planService;
            _environment = environment;
        }

        [HttpGet("GetAllPlans")]
        public async Task<IActionResult> GetAllPlans()
        {
            var plans = await _planService.GetAllAsync();
            if (plans == null || !plans.Any())
                return NotFound(new { message = "Planos nao encontrados" });

            return Ok(new { message = "Planos encontrados", plans });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPlanById(int id)
        {
            var plan = await _planService.GetByIdAsync(id);
            return plan == null
                ? NotFound(new { message = "Plano nao encontrado" })
                : Ok(plan);
        }

        [HttpPost("CreatePlan")]
        public async Task<IActionResult> CreatePlan([FromBody] PlanDTO plan)
        {
            if (plan == null || string.IsNullOrWhiteSpace(plan.Name) || plan.Price <= 0)
                return BadRequest(new { message = "Dados invalidos" });

            var added = await _planService.AddAsync(plan);
            if (!added) return StatusCode(500, new { message = "Erro ao criar o plano" });

            var created = await _planService.GetByCondition(p => p.Name == plan.Name);

            return CreatedAtAction(nameof(GetPlanById), new { id = created?.Id ?? plan.Id }, created ?? plan);
        }

        [HttpPut("UpdatePlan/{id:int}")]
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] PlanDTO plan)
        {
            if (plan == null)
                return BadRequest(new { message = "Dados invalidos" });

            var current = await _planService.GetByIdAsync(id);
            if (current == null)
                return NotFound(new { message = "Plano nao encontrado" });

            current.Name = plan.Name ?? current.Name;
            current.Description = plan.Description ?? current.Description;
            current.Price = plan.Price > 0 ? plan.Price : current.Price;
            current.ServicesAvailable = plan.ServicesAvailable > 0 ? plan.ServicesAvailable : current.ServicesAvailable;

            try
            {
                var updated = await _planService.UpdateAsync(current);
                if (!updated)
                    return StatusCode(500, new { message = "Erro ao atualizar o plano" });

                return Ok(current);
            }
            catch (Exception ex)
            {
                var details = _environment.IsDevelopment() ? ex.Message : null;
                return StatusCode(500, new { message = "Erro ao atualizar o plano", details });
            }
        }

        [HttpDelete("DeletePlan/{id:int}")]
        public async Task<IActionResult> DeletePlan(int id)
        {
            var deleted = await _planService.DeleteAsync(id);
            return deleted
                ? NoContent()
                : NotFound(new { message = "Plano nao encontrado" });
        }
    }
}
