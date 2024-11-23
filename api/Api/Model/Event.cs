using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Api.Model;

public class Event
{
    public int Id { get; set; }

    public required IdentityUser User { get; set; }

    [MaxLength(255)] public required string Title { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }
}