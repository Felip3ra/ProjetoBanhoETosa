using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoBanhoETosa.Domain.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime created_at { get; set; } = DateTime.Now;
        [Column(TypeName = "datetime2")]
        public DateTime? updated_at { get; set; } = DateTime.Now;
    }
}



