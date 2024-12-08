import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {EventService} from "../event.service";

@Component({
    selector: 'app-calendar',
    imports: [
        MatIcon,
        MatIconButton
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

    protected readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    constructor(protected eventService: EventService) {
    }

    async previousMonth() {
        let month = this.eventService.currentMonth - 1;
        let year = this.eventService.currentYear;

        if (month <= 0) {
            month = 12;
            year--;
        }

        await this.eventService.setEventRange(month, year);
    }

    async nextMonth() {
        let month = this.eventService.currentMonth + 1;
        let year = this.eventService.currentYear;

        if (month > 12) {
            month = 1;
            year++;
        }

        await this.eventService.setEventRange(month, year);
    }
}
