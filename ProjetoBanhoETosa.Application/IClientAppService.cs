using ProjetoBanhoETosa.Application.DTO;

namespace ProjetoBanhoETosa.Application
{
    public interface IClientAppService
    {
        Task<IEnumerable<ClientWithPlanDTO>> GetAllAsync();
        Task<ClientWithPlanDTO?> GetByIdAsync(int id);
        Task<(int totalClients, int totalPets)> GetSummaryAsync();
        Task<int> CreateAsync(ClientDTO client);
        Task<bool> UpdateAsync(int id, ClientDTO client);
        Task<bool> DeleteAsync(int id);
    }
}
