using System.Linq;
using System.Threading.Tasks;
using ProjetoBanhoETosa.Domain.Models;
using ProjetoBanhoETosa.Domain.Repository;

namespace ProjetoBanhoETosa.Application
{
    public class ClientSummaryService : IClientSummaryService
    {
        private readonly IRepository<Client> _clientRepository;
        private readonly IRepository<Pet> _petRepository;

        public ClientSummaryService(IRepository<Client> clientRepository, IRepository<Pet> petRepository)
        {
            _clientRepository = clientRepository;
            _petRepository = petRepository;
        }

        public async Task<(int totalClients, int totalPets)> GetSummaryAsync()
        {
            var clients = await _clientRepository.GetAll() ?? Enumerable.Empty<Client>();
            var pets = await _petRepository.GetAll() ?? Enumerable.Empty<Pet>();

            return (clients.Count(), pets.Count());
        }
    }
}
