using ProjetoBanhoETosa.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Application
{
    public interface IUserService
    {
        Task<UserDTO> VerificaUserAsync(UserDTO userDTO);
        Task<bool> RegistraUserAsync(UserDTO userDTO);
    }
}
