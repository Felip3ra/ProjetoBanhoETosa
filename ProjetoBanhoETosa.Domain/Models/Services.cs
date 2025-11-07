using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoBanhoETosa.Domain.Models
{
    public class Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        [Required]
        public int DurationInMinutes { get; set; }
        [Required]
        [Column(TypeName = "datetime2")]
        public DateTime created_at { get; set; }
        [Required]
        [Column(TypeName = "datetime2")]
        public DateTime updated_at { get; set; }
    }
}


