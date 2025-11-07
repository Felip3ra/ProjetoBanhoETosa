using Microsoft.AspNetCore.Mvc;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Infrastructure.Context;
using ProjetoBanhoETosa.Presentation.DTO;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("/api/[controller]")]
    public class UsersController : Controller
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult Index()
        {
            return Ok();
        }
        [HttpPost("/Autentication")]
        public IActionResult AutenticationLogin([FromBody] UserDTO userDTO)
        {
            User login = _context.Users.FirstOrDefault(u => u.Email == userDTO.Email && u.Password == userDTO.Password);
            if (login != null)
            {
                UserDTO userResponse = new UserDTO
                {
                    Name = login.Name,
                    Email = login.Email,
                    Password = login.Password
                };
                return Ok(new { message = "Login successful", user = userResponse });
            }
            
            return Unauthorized(new { message = "Invalid email or password" });
            
        }
        [HttpPost("/Register")]
        public IActionResult Register([FromBody] UserDTO userDTO)
        {
            User login = _context.Users.FirstOrDefault(u => u.Email == userDTO.Email);
            if (login != null)
            {
                return Unauthorized(new { message = "This email has already exist" });
            }
            User newUser = new User
            {
                Name = userDTO.Name,
                Email = userDTO.Email,
                Password = userDTO.Password,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return Ok(new { message = "User registered successfully", user = userDTO});
        }
    }
}
