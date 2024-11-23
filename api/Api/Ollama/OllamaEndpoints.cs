using System.Text.Json;

namespace Api.Ollama;

public static class OllamaEndpoints
{
    public static void MapOllamaEndpoints(this WebApplication app)
    {
        app.MapPut("/generate", async (IHttpClientFactory httpFactory, HttpRequest request) =>
            {
                var client = httpFactory.CreateClient("llm");
                var body = await new StreamReader(request.Body).ReadToEndAsync();
                var ollamaRequest = new OllamaRequest(body);
                var response = await client.PostAsJsonAsync("generate", ollamaRequest);

                response.EnsureSuccessStatusCode();

                var ollamaResponse = await response.Content.ReadFromJsonAsync<OllamaResponse>();
                var jsonResponse = JsonSerializer.Deserialize<JsonElement>(ollamaResponse?.Response ?? string.Empty);
                return Results.Json(jsonResponse);
            })
            .RequireAuthorization();
    }
}