import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {EventService} from "../event.service";
import {NgForOf} from "@angular/common";
import {TimesPipe} from "../times.pipe";
import {CellComponent} from "../cell/cell.component";

@Component({
    selector: 'app-calendar',
    imports: [
        MatIcon,
        MatIconButton,
        NgForOf,
        TimesPipe,
        CellComponent
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

    protected readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    protected startOffset = 0;
    protected dayCount = 0;

    constructor(protected eventService: EventService) {
        this.setProperties();
    }

    private setProperties() {
        this.startOffset = new Date(this.eventService.currentYear, this.eventService.currentMonth - 1).getDay() + 1;
        this.dayCount = new Date(this.eventService.currentYear, this.eventService.currentMonth, 0).getDate();
        console.log(this.dayCount);
    }

    async previousMonth() {
        let month = this.eventService.currentMonth - 1;
        let year = this.eventService.currentYear;

        if (month <= 0) {
            month = 12;
            year--;
        }

        await this.eventService.setEventRange(month, year);
        this.setProperties();
    }

    async nextMonth() {
        let month = this.eventService.currentMonth + 1;
        let year = this.eventService.currentYear;

        if (month > 12) {
            month = 1;
            year++;
        }

        await this.eventService.setEventRange(month, year);
        this.setProperties();
    }
}
