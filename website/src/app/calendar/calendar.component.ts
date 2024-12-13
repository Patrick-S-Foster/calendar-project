import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {EventService} from "../event.service";
import {NgForOf} from "@angular/common";
import {TimesPipe} from "../times.pipe";
import {CellComponent} from "../cell/cell.component";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-calendar',
    imports: [
        MatIcon,
        MatIconButton,
        NgForOf,
        TimesPipe,
        CellComponent,
        FormsModule
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

    @ViewChild('createEventDialog') createEventDialog!: ElementRef;

    protected readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    protected startOffset = 0;
    protected dayCount = 0;
    protected selectedDay = 0;

    constructor(protected eventService: EventService) {
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
        console.log(this.createEventDialog);
        this.createEventDialog.nativeElement.showModal();
    }
}
