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

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var createdAt = entityType.FindProperty("created_at");
                if (createdAt != null)
                    createdAt.SetColumnType("timestamp without time zone");

                var updatedAt = entityType.FindProperty("updated_at");
                if (updatedAt != null)
                    updatedAt.SetColumnType("timestamp without time zone");
            }
        }
        public DbSet<Plan> Plans { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Pet> Pets { get; set; }
        }
}
