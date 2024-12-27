namespace Api.Model;

/// <summary>
/// Event that will be returned to the caller of the API. The user is not included for security reasons.
/// </summary>
/// <param name="Id">primary key of the event</param>
/// <param name="Title">title of the event</param>
/// <param name="DateTime">date and time of the event</param>
public record ReturnEvent(int Id, string Title, DateTime DateTime);