using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Domain.Repository;
using ProjetoBanhoETosa.Infrastructure.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Infrastructure.Repository
{
    
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<User> Login(User user)
        {
            try
            {
                User exists = await _context.Users.FirstOrDefaultAsync(x => x.Email == user.Email);
                if (exists == null)
                {
                    return null;
                }
                bool passwordHash = BCrypt.Net.BCrypt.Verify(user.Password, exists.Password);
                if(passwordHash == false)
                {
                    return null;
                }
                return exists;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<bool> RegisterUser(User user)
        {
            try
            {
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
                user.Password = passwordHash;
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
