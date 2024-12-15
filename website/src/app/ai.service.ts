import {Injectable} from '@angular/core';
import {environment} from "../environments/environment";
import {EventService} from "./event.service";

@Injectable({
    providedIn: 'root'
})
export class AiService {

    constructor(private eventService: EventService) {
    }

    async generate(prompt: string): Promise<{ title: string, dateTime: Date } | null> {
        try {
            const response = await fetch(environment.generateUrl, {
                method: 'PUT',
                headers: this.eventService.getHeaders(),
                body: prompt
            });

            if (!response.ok) {
                return null;
            }

            const eventInfo = await response.json();
            const title = eventInfo.title;
            const date = eventInfo.date;
            const time = eventInfo.time;
            const year = date.substring(0, 4);
            const month = date.substring(5, 7);
            const day = date.substring(8, 10);
            const hour = time.substring(0, 2);
            const minute = time.substring(3, 5);

            return {title: title, dateTime: new Date(year, month - 1, day, hour, minute)};
        } catch (error) {
            return null;
        }
    }

}
