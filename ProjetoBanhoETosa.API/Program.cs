using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using ProjetoBanhoETosa.Application;
using ProjetoBanhoETosa.Domain.Repository;
using ProjetoBanhoETosa.Infrastructure.Context;
using ProjetoBanhoETosa.Infrastructure.Mappings;
using ProjetoBanhoETosa.Infrastructure.Repository;
// Permitir DateTime Kind Local/Unspecified para timestamp with time zone (compatibilidade)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);

var builder = WebApplication.CreateBuilder(args);

// Servi�os
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Projeto Banho e Tosa",
        Version = "v1",
        Description = "API desenvolvida em .NET 9 com Swagger habilitado"
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("ProjetoBanhoETosa.Infrastructure")
    )
);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped(typeof(IRepository<>),typeof(Repository<>));
builder.Services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped(typeof(IService<,>), typeof(Service<,>));
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IClientSummaryService, ClientSummaryService>();
builder.Services.AddScoped<IClientAppService, ClientAppService>();

var app = builder.Build();
app.UseCors("AllowAll");

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Projeto Banho e Tosa API v1");
        c.RoutePrefix = string.Empty; 
    });
}

app.UseHttpsRedirection();
// app.UseStaticFiles();
app.MapControllers();
// app.MapFallbackToFile("index.html");

app.Run();
