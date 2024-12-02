import {environment} from "../environments/environment";
import {Injectable} from '@angular/core';
import {CalendarEvent} from "./calendarEvent";

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private readonly accessTokenKey = 'AccessToken';
    private readonly refreshTokenKey = 'RefreshToken';
    private readonly refreshCachePercentage = 0.5;

    private refreshAt = 0;
    private lastRequestedMonth = new Date().getMonth() + 1;
    private lastRequestedYear = new Date().getFullYear();

    events: CalendarEvent[] = [];

    private clearTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        this.refreshAt = 0;
        this.events = [];
    }

    private async setTokens(response: Response) {
        if (!response.ok) {
            return false;
        }

        const json = await response.json();

        localStorage.setItem(this.accessTokenKey, json.accessToken);
        localStorage.setItem(this.refreshTokenKey, json.refreshToken);
        this.refreshAt = Date.now() + json.expiresIn * 1000 * this.refreshCachePercentage;

        return true;
    }

    private getHeaders(): { 'Content-Type': string, 'Authorization': string } | { 'Content-Type': string } {
        const bearerToken = localStorage.getItem(this.accessTokenKey);

        if (bearerToken != null) {
            return {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken
            };
        }

        return {'Content-Type': 'application/json'};
    }

    private async refresh(): Promise<boolean> {
        if (Date.now() < this.refreshAt) {
            return true;
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
    }

    async login(email: string, password: string) {
        await this.logout();

        const response = await fetch(environment.loginUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({email, password})
        });

        return this.setTokens(response);
    }

    private dateToString(date: Date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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

    async create(title: string, start: Date, end: Date) {
        if (!await this.refresh()) {
            return false;
        }

        const response = await fetch(environment.createUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                title: title,
                start: this.dateToString(start),
                end: this.dateToString(end),
            })
        });

        await this.setEventRange(this.lastRequestedMonth, this.lastRequestedYear);

        return response.ok;
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
        return events.map((event: { id: number, title: string, start: string, end: string }) => {
            return {
                id: event.id,
                title: event.title,
                start: this.stringToDate(event.start),
                end: this.stringToDate(event.end)
            };
        });
    }

    async setEventRange(month: number, year: number) {
        if (!await this.refresh()) {
            return false;
        }

        this.events = await this.getEvents(month, year);
        return true;
    }

    async update(id: number, title: string, start: Date, end: Date) {
        if (!await this.refresh()) {
            return false;
        }

        const response = await fetch(`${environment.updateUrl}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({
                title: title,
                start: this.dateToString(start),
                end: this.dateToString(end),
            })
        });
        return response.ok;
    }

    async delete(id: number) {
        if (!await this.refresh()) {
            return false;
        }

        const response = await fetch(`${environment.deleteUrl}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return response.ok;
    }
}
