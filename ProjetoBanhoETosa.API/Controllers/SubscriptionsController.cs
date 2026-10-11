using Microsoft.AspNetCore.Mvc;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("api/[controller]")]
    public class SubscriptionsController : Controller
    {
        private readonly IService<SubscriptionDTO, Subscription> _subscriptionService;
        
        public SubscriptionsController(IService<SubscriptionDTO, Subscription> subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpGet("GetAllSubscriptions")]
        public async Task<IActionResult> GetAllSubscriptions()
        {
            
            var subscriptions = await _subscriptionService.GetAllAsync();
            return Ok(new { message = "Assinaturas encontradas", subscription = subscriptions ?? Enumerable.Empty<SubscriptionDTO>() });
        }
        [HttpPut("ConfirmPayment")]
        public async Task<IActionResult> ConfirmPayment([FromBody] SubscriptionDTO subscription)
        {
            if (subscription == null)
            {
                return BadRequest(new { message = "Os dados do formulario estao nulos" });
            }
            subscription.StartDate = DateTime.SpecifyKind(subscription.StartDate, DateTimeKind.Utc);
            subscription.EndDate = DateTime.SpecifyKind(subscription.EndDate, DateTimeKind.Utc);
            bool updated = await _subscriptionService.UpdateAsync(subscription);
            if (!updated)
                return StatusCode(500, new { message = "Erro ao atualizar a assinatura." });

            return Ok(new { message = "Assinatura atualizada", Subscription = subscription });
        }
        [HttpPost("CreateSubscription")]
        public async Task<IActionResult> CreateSubscription([FromBody] SubscriptionDTO subscription)
        {
            if (subscription == null)
            {
                return BadRequest(new { message = "Os dados do formulario estao nulos" });
            }
            subscription.StartDate = DateTime.SpecifyKind(subscription.StartDate, DateTimeKind.Utc);
            subscription.EndDate = DateTime.SpecifyKind(subscription.EndDate, DateTimeKind.Utc);
            try
            {
                bool added = await _subscriptionService.AddAsync(subscription);
                if (!added)
                    return StatusCode(500, new { message = "Erro ao criar a assinatura." });

                var created = await _subscriptionService.GetByCondition(s =>
                    s.CustomerName == subscription.CustomerName &&
                    s.PlanName == subscription.PlanName &&
                    s.StartDate == subscription.StartDate);

                return CreatedAtAction(nameof(GetAllSubscriptions), new { id = created?.Id ?? subscription.Id }, new
                {
                    message = "Assinatura criada com sucesso!",
                    Subscription = created ?? subscription
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro ao criar a assinatura: {ex.Message}" });
            }
        }
        [HttpDelete("DeleteSubscription")]
        public async Task<IActionResult> DeleteSubscription([FromBody] SubscriptionDTO subscription)
        {
            if (subscription == null)
            {
                return BadRequest(new { message = "Os dados do formulario estao nulos" });
            }
            bool deleted = await _subscriptionService.DeleteAsync(subscription.Id);
            if (!deleted)
                return StatusCode(500, new { message = "Erro ao deletar a assinatura." });

            return Ok(new { message = "Assinatura atualizada", Subscription = subscription });
        }
    }
}
