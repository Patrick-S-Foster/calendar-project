using System.Text.Json.Serialization;

namespace Api.Ollama;

/// <summary>
/// Used to receive a response from the Ollama API.
/// </summary>
public class OllamaResponse
{
    /// <summary>
    /// Response from the Ollama API.
    /// </summary>
    [JsonPropertyName("response")]
    public string Response { get; set; } = string.Empty;
}