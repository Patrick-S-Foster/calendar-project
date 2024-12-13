import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {EventService} from "../event.service";
import {NgForOf} from "@angular/common";
import {TimesPipe} from "../times.pipe";
import {CellComponent} from "../cell/cell.component";
import {FormsModule} from "@angular/forms";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreateEventFormComponent} from "../create-event-form/create-event-form.component";

@Component({
    selector: 'app-calendar',
    imports: [
        MatIcon,
        MatIconButton,
        NgForOf,
        TimesPipe,
        CellComponent,
        FormsModule,
        MatMiniFabButton
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

    private readonly defaultHour = 9;
    private readonly defaultMinute = 0;

    protected readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    protected startOffset = 0;
    protected dayCount = 0;
    protected selectedDay = 0;

    constructor(protected eventService: EventService, private dialog: MatDialog) {
        this.setProperties();
    }

    private setProperties() {
        this.startOffset = new Date(this.eventService.currentYear, this.eventService.currentMonth - 1).getDay() + 1;
        this.dayCount = new Date(this.eventService.currentYear, this.eventService.currentMonth, 0).getDate();

        const today = new Date();
        if (today.getMonth() + 1 === this.eventService.currentMonth &&
            today.getFullYear() === this.eventService.currentYear) {
            this.selectedDay = today.getDate();
        } else {
            this.selectedDay = 1;
        }
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

    cellClicked(day: number) {
        this.selectedDay = day;
    }

    showDialog() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();

        let date: Date;

        if (currentYear === this.eventService.currentYear && currentMonth === this.eventService.currentMonth && currentDay === this.selectedDay) {
            date = new Date();
        } else {
            date = new Date(this.eventService.currentYear, this.eventService.currentMonth - 1, this.selectedDay, this.defaultHour, this.defaultMinute);
        }

        this.dialog.open(CreateEventFormComponent, {data: date});
    }
}
