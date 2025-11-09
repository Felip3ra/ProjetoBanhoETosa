using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoBanhoETosa.Domain.Models
{
    public class Plan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        public int ServicesAvailable { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime created_at { get; set; } = DateTime.Now;
        [Column(TypeName = "datetime2")]
        public DateTime? updated_at { get; set; } = DateTime.Now;
    }
}
