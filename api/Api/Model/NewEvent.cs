namespace Api.Model;

/// <summary>
/// Used to create a new event from an API request.
/// </summary>
public class NewEvent
{
    /// <summary>
    /// Title of the event.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Date and time of the event.
    /// </summary>
    public required DateTime DateTime { get; set; }
}