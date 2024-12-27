using System.Security.Claims;
using Api.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api;

public static class Endpoints
{
    public static void MapLogoutEndpoint(this WebApplication app)
    {
        // POST /logout
        // Logs out the current user
        app.MapPost("/logout", async (SignInManager<IdentityUser> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return Results.Ok();
            })
            .RequireAuthorization();
    }

    public static void MapCrudEndpoints(this WebApplication app)
    {
        // POST /create
        // Creates a new event
        app.MapPost("/create", async (CalendarDbContext db, UserManager<IdentityUser> userManager,
                ClaimsPrincipal claimsPrincipal, [FromBody] NewEvent e) =>
            {
                if (await userManager.GetUserAsync(claimsPrincipal) is not { } user)
                {
                    return Results.Unauthorized();
                }

                db.Events.Add(new Event
                {
                    User = user,
                    Title = e.Title,
                    DateTime = e.DateTime
                });
                await db.SaveChangesAsync();

                return Results.Ok();
            })
            .RequireAuthorization();

        // GET /events/{year:int}/{month:int}
        // Returns all events for the given year and month
        app.MapGet("/events/{year:int}/{month:int}",
                async (CalendarDbContext db, UserManager<IdentityUser> userManager, ClaimsPrincipal claimsPrincipal,
                    int year, int month) =>
                {
                    if (await userManager.GetUserAsync(claimsPrincipal) is not { } user)
                    {
                        return Results.Unauthorized();
                    }

                    return Results.Json(db.Events.Where(e =>
                            e.User == user &&
                            e.DateTime.Year == year &&
                            e.DateTime.Month == month)
                        .Select(e => new ReturnEvent(e.Id, e.Title, e.DateTime)));
                })
            .RequireAuthorization();

        // PUT /update/{id:int}
        // Updates the event with the given id
        app.MapPut("/update/{id:int}", async (CalendarDbContext db, UserManager<IdentityUser> userManager,
                ClaimsPrincipal claimsPrincipal, int id, [FromBody] NewEvent e) =>
            {
                if (await userManager.GetUserAsync(claimsPrincipal) is not { } user)
                {
                    return Results.Unauthorized();
                }

                if (await db.Events.FindAsync(id) is not { } existingEvent || existingEvent.User != user)
                {
                    return Results.NotFound();
                }

                existingEvent.Title = e.Title;
                existingEvent.DateTime = e.DateTime;
                await db.SaveChangesAsync();

                return Results.Ok();
            })
            .RequireAuthorization();

        // DELETE /delete/{id:int}
        // Deletes the event with the given id
        app.MapDelete("/delete/{id:int}", async (CalendarDbContext db, UserManager<IdentityUser> userManager,
                ClaimsPrincipal claimsPrincipal, int id) =>
            {
                if (await userManager.GetUserAsync(claimsPrincipal) is not { } user)
                {
                    return Results.Unauthorized();
                }

                if (await db.Events.FindAsync(id) is not { } existingEvent || existingEvent.User != user)
                {
                    return Results.NotFound();
                }

                db.Events.Remove(existingEvent);
                await db.SaveChangesAsync();

                return Results.Ok();
            })
            .RequireAuthorization();
    }
}