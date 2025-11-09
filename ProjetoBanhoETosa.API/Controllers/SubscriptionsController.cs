using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Infrastructure.Context;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("/api/[controller]")]
    public class SubscriptionsController : Controller
    {
        private readonly AppDbContext _context;
        public SubscriptionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("/GetAllSubscriptions")]
        public IActionResult GetAllSubscriptions()
        {
            List<Subscription> subscriptions = _context.Subscriptions.ToList();
            if (subscriptions == null || subscriptions.Count == 0)
            {
                return NotFound(new { message = "Assinaturas Encontradas" });
            }
            return Ok(new { message = "Assinaturas Encontradas", Subscription = subscriptions });
        }
        [HttpPut("/UpdateSubscription")]
        public IActionResult UpdateSubscription([FromBody] Subscription subscription)
        {
            if (subscription == null)
            {
                return BadRequest("Os Dados do formulário estão nulos");
            }

            _context.Entry(subscription).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(new { message = "Assinatura Atualizada", Subscription = subscription });
        }
        [HttpPost("/CreateSubscription")]
        public IActionResult CreateSubscription([FromBody] Subscription subscription)
        {
            if (subscription == null)
            {
                return BadRequest("Os Dados do formulário estão nulos");
            }
            _context.Subscriptions.Add(subscription);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAllSubscriptions), new { id = subscription.Id }, new
            {
                message = "Assinatura criada com sucesso!",
                Subscription = subscription
            });
        }
        [HttpDelete]
        public IActionResult DeleteSubscription([FromBody] Subscription subscription)
        {
            if (subscription == null)
            {
                return BadRequest("Os Dados do formulário estão nulos");
            }

            _context.Entry(subscription).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(new { message = "Assinatura Atualizada", Subscription = subscription });
        }
    }
}
