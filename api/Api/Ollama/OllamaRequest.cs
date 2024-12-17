using System.Text.Json.Serialization;

namespace Api.Ollama;

public class OllamaRequest(string prompt)
{
    [JsonPropertyName("model")] public string Model => "gemma2:2b";

    [JsonPropertyName("prompt")]
    public string Prompt => $"""
                             User input will be given to you at the very end of this message. You must determine the following items in the context of a calendar scheduling app:

                             1. the title (maximum length of 100 characters)
                             2. the date (in the format yyyy-MM-dd)
                             3. the time (in the format HH:mm)

                             Relative dates and times such as today, tomorrow, next week, next year, etc., should be calculated offset to the current date/time of '{DateTime.Now:f}' (i.e., tomorrow is '{DateTime.Now.AddDays(1):f}', one week from today is '{DateTime.Now.AddDays(7):f}', one month from today is '{DateTime.Now.AddMonths(1):f}', etc.). The three items should be returned as a JSON object, with the keys "title", "date", and "time". If the user supplies an explicit date, then use it, if not, use tomorrow. If the user supplies a time, then use it, if not, DO NOT USE THE CURRENT TIME, use 10:00 instead.

                             Here is the user input:

                             {prompt}
                             """;

    [JsonPropertyName("format")] public string Format => "json";

    [JsonPropertyName("stream")] public bool Stream => false;
}