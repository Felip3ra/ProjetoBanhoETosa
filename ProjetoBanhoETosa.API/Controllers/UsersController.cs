using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Infrastructure.Context;

namespace ProjetoBanhoETosa.Presentation.Controllers
{
    [Route("/api/[controller]")]
    public class UsersController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IUserService _userService;
        public UsersController(AppDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }
        
        [HttpPost("Autentication")]
        public async Task<IActionResult> AutenticationLogin([FromBody] UserDTO userDTO)
        {
            if (userDTO == null)
            {
                return Unauthorized(new { message = "Invalid Form" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDTO.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            UserDTO userValidated = await _userService.VerificaUserAsync(userDTO);
            if (userValidated == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }
            
            return Ok(new
            {
                message = "User is valid",
                user = userValidated
            });
            
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UserDTO userDTO)
        {
            if (userDTO == null)
            {
                return Unauthorized(new { message = "Invalid Form" });
            }
            
            bool registrado = await _userService.RegistraUserAsync(userDTO);
            if (!registrado)
            {
                return BadRequest(new { message = "Error registering user" });
            }
            var createdUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDTO.Email);
            
            return Ok(new { message = "User registered successfully", user = userDTO });
        }
    }
}
