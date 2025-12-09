using System;

namespace ProjetoBanhoETosa.Application.DTO
{
    public class ClientWithPlanDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string? Email { get; set; }
        public string? PetName { get; set; }
        public string? PetSpecies { get; set; }
        public string? ActivePlanName { get; set; }
        public int? ActiveSubscriptionId { get; set; }
        public DateTime? ActivePlanExpiresAt { get; set; }
    }
}
