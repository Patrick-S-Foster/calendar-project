using System.Security.Claims;
using Api.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api;

public static class Endpoints
{
    public static void MapLogoutEndpoint(this WebApplication app)
    {
        app.MapPost("/logout", async (SignInManager<IdentityUser> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return Results.Ok();
            })
            .RequireAuthorization();
    }

    public static void MapCrudEndpoints(this WebApplication app)
    {
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
                    Start = e.Start,
                    End = e.End
                });
                await db.SaveChangesAsync();

                return Results.Ok();
            })
            .RequireAuthorization();

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
                        e.Start.Year <= year &&
                        e.Start.Month <= month &&
                        e.End.Year >= year &&
                        e.End.Month >= month));
                })
            .RequireAuthorization();

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
                existingEvent.Start = e.Start;
                existingEvent.End = e.End;
                await db.SaveChangesAsync();

                return Results.Ok();
            })
            .RequireAuthorization();

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