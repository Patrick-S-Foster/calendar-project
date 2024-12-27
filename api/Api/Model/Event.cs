using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Api.Model;

/// <summary>
/// Represents an event in the database.
/// </summary>
public class Event
{
    /// <summary>
    /// Primary key of the event.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// User that created the event.
    /// </summary>
    public required IdentityUser User { get; set; }

    /// <summary>
    /// Title of the event. 
    /// </summary>
    [MaxLength(255)]
    public required string Title { get; set; }

    /// <summary>
    /// Date and time of the event.
    /// </summary>
    public DateTime DateTime { get; set; }
}