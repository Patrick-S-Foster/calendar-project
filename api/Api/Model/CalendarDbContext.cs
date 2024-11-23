using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Model;

public class CalendarDbContext(DbContextOptions<CalendarDbContext> options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<Event> Events { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Event>()
            .HasOne(e => e.User)
            .WithMany()
            .IsRequired();
    }
}