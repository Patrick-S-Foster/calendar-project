using System.Text.Json.Serialization;

namespace Api.Ollama;

public class OllamaRequest(string prompt)
{
    [JsonPropertyName("model")] public string Model => "gemma2:2b";

    [JsonPropertyName("prompt")]
    public string Prompt => $"""
                             User input will be given to you at the very end of this message. You must determine the following items in the context of a calendar scheduling app:

                             1. the title (maximum length of 100 characters)
                             2. the start date (in the format yyyy-MM-dd)
                             3. the start time (in the format HH:mm)
                             4. the end date (in the format yyyy-MM-dd)
                             5. the end time (in the format HH:mm)

                             Relative dates and times such as today, tomorrow, next week, next year, etc., should be calculated offset to the current date/time of {DateTime.Now:f}. The five items should be returned as a JSON object, with the keys "title", "start-date", "start-time", "end-date", and "end-time".

                             If the user supplies an explicit start date/time then use it, if not, default to tomorrow between 10:00 and 16:00. If the user supplies an explicit end date/time then use it, if not, default to one hour after the start date/time. Finally, be sure that the events NEVER start and end at the same time, and that the end date/time is always after the start date/time.

                             Here is the user input:

                             {prompt}
                             """;

    [JsonPropertyName("format")] public string Format => "json";

    [JsonPropertyName("stream")] public bool Stream => false;
}