using System.Text.Json.Serialization;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Presentation.DTO
{
    public class AppointmentDTO
    {
        public int Id { get; set; }

        [JsonPropertyName("petName")]
        public string PetName { get; set; }

        [JsonPropertyName("owner")]
        public string OwnerName { get; set; }

        [JsonPropertyName("phone")]
        public string Phone { get; set; }

        // O front manda "service": "Banho e Tosa"
        [JsonPropertyName("service")]
        public string ServiceName { get; set; } // temporário, converter depois para ServiceId

        [JsonPropertyName("date")]
        public string AppointmentDateString { get; set; }

        [JsonPropertyName("time")]
        public string AppointmentTimeString { get; set; }

        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        [JsonPropertyName("paymentMethod")]
        public string PaymentMethodString { get; set; }

        // Campos internos (não vindos diretamente do front)
        public int ServiceId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; }
        [JsonIgnore]
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pendente;
        public bool HasSubscription { get; set; }
        public int? SubscriptionId { get; set; }
    }
}
