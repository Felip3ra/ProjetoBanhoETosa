using Microsoft.AspNetCore.Mvc;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    public class ServicesController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok();
        }
    }
}
