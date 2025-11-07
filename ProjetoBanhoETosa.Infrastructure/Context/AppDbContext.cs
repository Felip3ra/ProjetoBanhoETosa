using Microsoft.EntityFrameworkCore;
using ProjetoBanhoETosa.Domain.Models;

namespace ProjetoBanhoETosa.Infrastructure.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Converter ENUM para string
            modelBuilder.Entity<Appointment>()
                .Property(a => a.PaymentMethod)
                .HasConversion<string>();

            modelBuilder.Entity<Appointment>()
                .Property(a => a.PaymentStatus)
                .HasConversion<string>();

            base.OnModelCreating(modelBuilder);
        }
        public DbSet<Plan> Plans { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        }
}
