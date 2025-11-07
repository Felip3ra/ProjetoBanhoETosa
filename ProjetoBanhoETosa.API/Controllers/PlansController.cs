using Microsoft.AspNetCore.Mvc;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    public class PlansController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok();
        }
    }
}
