using AutoMapper;
using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Application
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IRepository<Appointment> _appointmentRepository;
        public UserService(IUserRepository userRepository, IMapper mapper, IRepository<Appointment> appointmentRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _appointmentRepository = appointmentRepository;
        }
        #region User
        public Task<bool> RegistraUserAsync(UserDTO userDTO)
        {
            User user = _mapper.Map<User>(userDTO);
            return _userRepository.RegisterUser(user);
        }

        public async Task<UserDTO> VerificaUserAsync(UserDTO userDTO)
        {
            User user = _mapper.Map<User>(userDTO);
            User result = await _userRepository.Login(user);
            if (result != null)
            {
                UserDTO userResult = _mapper.Map<UserDTO>(result);
                return userResult;
            }
            return null;
        }
        #endregion
    }
}
