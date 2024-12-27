import {environment} from "../environments/environment";
import {Injectable} from '@angular/core';
import {CalendarEvent} from "./calendarEvent";

// Provides methods and properties to interact with a user's account and events
@Injectable({
    providedIn: 'root'
})
export class EventService {

    // Used to store the access token in local storage
    private readonly accessTokenKey = 'AccessToken';

    // Used to store the refresh token in local storage
    private readonly refreshTokenKey = 'RefreshToken';

    // Used to store the refresh at time in local storage
    private readonly refreshAtKey = 'RefreshAt';

    // Used to determine the percentage of the refresh time to elapse before a refresh call is made
    private readonly refreshCachePercentage = 0.5;

    // Current refresh at time
    private refreshAt = 0;

    // True if the user is currently logged in
    loggedIn = false;

    // The current one-based month
    currentMonth = new Date().getMonth() + 1;

    // The current year
    currentYear = new Date().getFullYear();

    // The current events in the month and year
    events: CalendarEvent[] = [];

    constructor() {
        // Retrieve values from local storage
        const accessToken = localStorage.getItem(this.accessTokenKey);
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        const refreshAt = parseInt(localStorage.getItem(this.refreshAtKey) ?? 'NaN');

        if (accessToken === null || refreshToken === null || Number.isNaN(refreshAt)) {
            return;
        }

        this.refreshAt = refreshAt;
        this.loggedIn = true;
    }

    private clearTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.refreshAtKey);
        this.refreshAt = 0;
        this.currentMonth = new Date().getMonth() + 1;
        this.currentYear = new Date().getFullYear();
        this.events = [];
        this.loggedIn = false;
    }

    private async setTokens(response: Response) {
        if (!response.ok) {
            this.loggedIn = false;
            return;
        }

        const json = await response.json();

        // The "expiresIn" value is given in seconds, and must be converted to milliseconds
        this.refreshAt = Date.now() + json.expiresIn * 1000 * this.refreshCachePercentage;

        localStorage.setItem(this.accessTokenKey, json.accessToken);
        localStorage.setItem(this.refreshTokenKey, json.refreshToken);
        localStorage.setItem(this.refreshAtKey, this.refreshAt.toString());

        this.loggedIn = true;
    }

    getHeaders(): { 'Content-Type': string, 'Authorization': string } | { 'Content-Type': string } {
        const bearerToken = localStorage.getItem(this.accessTokenKey);

        if (bearerToken != null) {
            return {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken
            };
        }

        return {'Content-Type': 'application/json'};
    }

    private async refresh() {
        if (Date.now() < this.refreshAt) {
            return;
        }

        const response = await fetch(environment.refreshUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({refreshToken: localStorage.getItem(this.refreshTokenKey)})
        });

        return this.setTokens(response);
    }

    async logout() {
        await fetch(environment.logoutUrl, {
            method: 'POST',
            headers: this.getHeaders()
        });

        this.clearTokens();
    }

    async register(email: string, password: string): Promise<string[]> {
        try {
            await this.logout();

            const response = await fetch(environment.registerUrl, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({email, password})
            });

            if (response.ok) {
                return [];
            }

            const json = await response.json();
            return Object.values(json.errors);
        } catch (error: any) {
            return [`An error occurred with the following message: '${error.message}'`];
        }
    }

    async login(email: string, password: string) {
        try {
            await this.logout();

            const response = await fetch(environment.loginUrl, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({email, password})
            });

            await this.setTokens(response);
            return this.loggedIn;
        } catch {
            return false;
        }
    }

    private stringToDate(dateString: string) {
        return new Date(
            Number(dateString.substring(0, 4)),
            Number(dateString.substring(5, 7)) - 1,
            Number(dateString.substring(8, 10)),
            Number(dateString.substring(11, 13)),
            Number(dateString.substring(14, 16)),
            Number(dateString.substring(17, 19)))
    }

    private dateToString(date: Date) {
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    async create(title: string, dateTime: Date) {
        try {
            await this.refresh();

            if (!this.loggedIn) {
                return false;
            }

            const response = await fetch(environment.createUrl, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    title: title,
                    dateTime: this.dateToString(dateTime)
                })
            });

            await this.refreshEvents();

            return response.ok;
        } catch {
            return false;
        }
    }

    private async getEvents(month: number, year: number): Promise<CalendarEvent[]> {
        const response = await fetch(`${environment.getEventsUrl}/${year}/${month}`, {
            method: 'GET',
            headers: this.getHeaders()
        })

        if (!response.ok) {
            return [];
        }

        const events = await response.json();
        return events.map((event: { id: number, title: string, dateTime: string }) => {
            return {
                id: event.id,
                title: event.title,
                dateTime: this.stringToDate(event.dateTime)
            };
        });
    }

    refreshEvents() {
        return this.setEventRange(this.currentMonth, this.currentYear);
    }

    async setEventRange(month: number, year: number) {
        await this.refresh();

        this.currentMonth = month;
        this.currentYear = year;

        if (this.loggedIn) {
            this.events = await this.getEvents(month, year);
        }
    }

    async update(id: number, title: string, dateTime: Date) {
        try {
            await this.refresh();

            if (!this.loggedIn) {
                return false;
            }

            const response = await fetch(`${environment.updateUrl}/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    title: title,
                    dateTime: this.dateToString(dateTime)
                })
            });

            await this.refreshEvents();
            return response.ok;
        } catch {
            return false;
        }
    }

    async delete(id: number) {
        try {
            await this.refresh();

            if (!this.loggedIn) {
                return false;
            }

            const response = await fetch(`${environment.deleteUrl}/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            await this.refreshEvents();
            return response.ok;
        } catch {
            return false;
        }
    }
}
