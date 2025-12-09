using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Application
{
    public interface IClientSummaryService
    {
        Task<(int totalClients, int totalPets)> GetSummaryAsync();
    }
}
