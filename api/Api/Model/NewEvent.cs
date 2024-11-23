namespace Api.Model;

public class NewEvent
{
    public required string Title { get; set; }

    public required DateTime Start { get; set; }

    public required DateTime End { get; set; }
}