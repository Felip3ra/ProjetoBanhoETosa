namespace ProjetoBanhoETosa.Application.DTO
{
    public class PetDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Species { get; set; }
        public string? Breed { get; set; }
        public int? Age { get; set; }
        public string? Notes { get; set; }
        public int ClientId { get; set; }
        public int? PlanId { get; set; }
    }
}
