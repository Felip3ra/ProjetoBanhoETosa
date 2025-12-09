using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoBanhoETosa.Domain.Models
{
    public class Pet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(120)]
        public string Name { get; set; }

        [Required]
        [StringLength(60)]
        public string Species { get; set; }

        [StringLength(120)]
        public string? Breed { get; set; }

        public int? Age { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [ForeignKey(nameof(Client))]
        public int ClientId { get; set; }

        [ForeignKey(nameof(Plan))]
        public int? PlanId { get; set; }

        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;

        public Client Client { get; set; }
        public Plan? Plan { get; set; }
    }
}
