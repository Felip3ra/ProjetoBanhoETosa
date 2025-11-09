using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoBanhoETosa.Domain.Models
{
    public enum PaymentMethod
    {
        Pix,
        Dinheiro,
        CartaoDebito,
        CartaoCredito,
        Plano
    }

    public enum PaymentStatus
    {
        Pendente,
        Pago
    }
    public class Appointment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [StringLength(100)]
        public string PetName { get; set; }
        [StringLength(100)]
        public string OwnerName { get; set; }
        [Phone]
        public string Phone { get; set; }
        [ForeignKey(nameof(Service))]
        public int ServiceId { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        [Required]
        public PaymentMethod PaymentMethod { get; set; }
        [Required]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pendente;
        [Column(TypeName = "bit")]
        public bool HasSubscription { get; set; }
        [ForeignKey(nameof(Subscription))]
        public int? SubscriptionId { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        [Column(TypeName = "datetime2")]
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;

        public Service Service { get; set; }
        public Subscription Subscriptions { get; set; }

    }
}
