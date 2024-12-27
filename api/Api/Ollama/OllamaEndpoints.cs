using System.Text.Json;

namespace Api.Ollama;

public static class OllamaEndpoints
{
    public static void MapOllamaEndpoints(this WebApplication app)
    {
        // GET /api/ollama/generate
        // Uses the body of the request to generate a response from the Ollama API
        app.MapPut("/generate", async (IHttpClientFactory httpFactory, HttpRequest request) =>
            {
                // Create a new client using the "llm" named client and post the request to the Ollama API
                var client = httpFactory.CreateClient("llm");
                var body = await new StreamReader(request.Body).ReadToEndAsync();
                var ollamaRequest = new OllamaRequest(body);
                var response = await client.PostAsJsonAsync("generate", ollamaRequest);

                response.EnsureSuccessStatusCode();

                // Read the response from the Ollama API and return it as a JSON response
                var ollamaResponse = await response.Content.ReadFromJsonAsync<OllamaResponse>();
                var jsonResponse = JsonSerializer.Deserialize<JsonElement>(ollamaResponse?.Response ?? string.Empty);
                return Results.Json(jsonResponse);
            })
            .RequireAuthorization();
    }
}