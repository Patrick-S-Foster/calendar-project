using System.Text.Json.Serialization;

namespace Api.Ollama;

public class OllamaResponse
{
    [JsonPropertyName("response")] public string Response { get; set; } = string.Empty;
}