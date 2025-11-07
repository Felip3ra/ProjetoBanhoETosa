using ProjetoBanhoETosa.Domain.Models;


namespace ProjetoBanhoETosa.Presentation.DTO
{
    public class AppointmentDTO
    {
        public int Id { get; set; }
        
        public string PetName { get; set; }
        
        public string OwnerName { get; set; }
       
        public string Phone { get; set; }
       
        public int ServiceId { get; set; }
       
        public DateTime AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; }
       
        public decimal Price { get; set; }
        
        public PaymentMethod PaymentMethod { get; set; }
        
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pendente;
      
        public bool HasSubscription { get; set; }
       
        public int? SubscriptionId { get; set; }
        
    }
}
