using ProjetoBanhoETosa.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Domain.Repository
{
    public interface IUserRepository
    {
        Task<bool> RegisterUser(User user);
        Task<User> Login(User user);
    }
}
