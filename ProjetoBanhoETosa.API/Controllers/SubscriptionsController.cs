using Microsoft.AspNetCore.Mvc;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    public class SubscriptionsController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok();
        }
    }
}
