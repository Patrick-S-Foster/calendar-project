using Api;
using Api.Model;
using Api.Ollama;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

if (builder.Configuration["DB_CONNECTION_STRING"] is not { } connectionString)
{
    throw new Exception("Connection string must be set in the docker compose file.");
}

if (builder.Configuration["DB_PASSWORD_FILE"] is not { } dbPasswordFile)
{
    throw new Exception("Password file must be set via docker secrets.");
}

var dbPassword = File.ReadAllText(dbPasswordFile);
var fullConnectionString = string.Format(connectionString, dbPassword);

builder.Services.AddDbContext<CalendarDbContext>(options => options.UseMySQL(fullConnectionString));

builder.Services.AddHttpClient("llm", client => client.BaseAddress = new Uri("http://ollama:11434/api/generate"));

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<CalendarDbContext>();

var app = builder.Build();

app.MapIdentityApi<IdentityUser>();
app.MapOllamaEndpoints();
app.MapLogoutEndpoint();
app.MapCrudEndpoints();

app.Run();