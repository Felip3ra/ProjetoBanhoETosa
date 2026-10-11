using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Application
{
    public class ClientAppService : IClientAppService
    {
        private readonly IService<ClientDTO, Client> _clientService;
        private readonly IService<SubscriptionDTO, Subscription> _subscriptionService;
        private readonly IService<PetDTO, Pet> _petService;
        private readonly IClientSummaryService _clientSummaryService;

        public ClientAppService(
            IService<ClientDTO, Client> clientService,
            IService<SubscriptionDTO, Subscription> subscriptionService,
            IService<PetDTO, Pet> petService,
            IClientSummaryService clientSummaryService)
        {
            _clientService = clientService;
            _subscriptionService = subscriptionService;
            _petService = petService;
            _clientSummaryService = clientSummaryService;
        }

        public async Task<IEnumerable<ClientWithPlanDTO>> GetAllAsync()
        {
            var clients = await _clientService.GetAllAsync() ?? Enumerable.Empty<ClientDTO>();
            var subscriptions = await _subscriptionService.GetAllAsync() ?? Enumerable.Empty<SubscriptionDTO>();
            var now = DateTime.Now;

            return clients.Select(c => MapWithActivePlan(c, subscriptions, now));
        }

        public async Task<ClientWithPlanDTO?> GetByIdAsync(int id)
        {
            var client = await _clientService.GetByIdAsync(id);
            if (client == null) return null;

            var subscriptions = await _subscriptionService.GetAllAsync() ?? Enumerable.Empty<SubscriptionDTO>();
            var now = DateTime.Now;
            return MapWithActivePlan(client, subscriptions, now);
        }

        public async Task<(int totalClients, int totalPets)> GetSummaryAsync()
        {
            return await _clientSummaryService.GetSummaryAsync();
        }

        public async Task<int> CreateAsync(ClientDTO client)
        {
            var created = await _clientService.AddAsync(client);
            if (!created) return -1;

            var saved = await _clientService.GetByCondition(c => c.Email == client.Email && c.Phone == client.Phone);
            var savedId = saved?.Id ?? client.Id;

            if (!string.IsNullOrWhiteSpace(client.PetName) && savedId > 0)
            {
                var petDto = new PetDTO
                {
                    Name = client.PetName,
                    Species = string.IsNullOrWhiteSpace(client.PetSpecies) ? "Desconhecido" : client.PetSpecies,
                    ClientId = savedId
                };
                await _petService.AddAsync(petDto);
            }

            return savedId;
        }

        public async Task<bool> UpdateAsync(int id, ClientDTO client)
        {
            var existing = await _clientService.GetByIdAsync(id);
            if (existing == null) return false;

            existing.Name = !string.IsNullOrWhiteSpace(client.Name) ? client.Name : existing.Name;
            existing.Phone = !string.IsNullOrWhiteSpace(client.Phone) ? client.Phone : existing.Phone;
            existing.Email = client.Email ?? existing.Email;

            return await _clientService.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _clientService.DeleteAsync(id);
        }

        private static ClientWithPlanDTO MapWithActivePlan(ClientDTO client, IEnumerable<SubscriptionDTO> subscriptions, DateTime now)
        {
            var active = subscriptions
                .Where(s =>
                    s.CustomerName?.Equals(client.Name, StringComparison.OrdinalIgnoreCase) == true &&
                    s.PaymentStatus?.Equals("pago", StringComparison.OrdinalIgnoreCase) == true &&
                    s.EndDate >= now &&
                    s.ServicesUsed < s.ServicesAvailable)
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefault();

            return new ClientWithPlanDTO
            {
                Id = client.Id,
                Name = client.Name,
                Phone = client.Phone,
                Email = client.Email,
                PetName = client.PetName,
                PetSpecies = client.PetSpecies,
                ActivePlanName = active?.PlanName,
                ActiveSubscriptionId = active?.Id,
                ActivePlanExpiresAt = active?.EndDate
            };
        }
    }
}
