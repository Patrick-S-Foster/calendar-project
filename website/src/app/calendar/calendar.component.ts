import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {EventService} from "../event.service";
import {NgForOf} from "@angular/common";
import {TimesPipe} from "../times.pipe";
import {CellComponent} from "../cell/cell.component";
import {FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
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
export class CalendarComponent implements AfterViewInit {

    private readonly defaultHour = 9;
    private readonly defaultMinute = 0;

    protected readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    @ViewChild('cells') cells!: ElementRef;

    protected startOffset = 0;
    protected dayCount = 0;
    protected selectedDay = 0;

    constructor(protected eventService: EventService, private dialog: MatDialog) {
        this.setProperties();
    }

    async ngAfterViewInit() {
        this.setStyleVariables();
        new ResizeObserver(this.setStyleVariables.bind(this)).observe(this.cells.nativeElement);
        await this.eventService.refreshEvents();
    }

    protected getTrailingEmptyCellCount() {
        const remainder = (this.startOffset + this.dayCount) % 7;

        if (remainder === 0) {
            return 0;
        }

        return 7 - remainder;
    }

    protected getEventsByDay(day: number) {
        return this.eventService.events.filter(event =>
            event.dateTime.getFullYear() === this.eventService.currentYear &&
            event.dateTime.getMonth() + 1 === this.eventService.currentMonth &&
            event.dateTime.getDate() === day)
            .sort((first, second) => {
                if (first.dateTime < second.dateTime) {
                    return -1;
                }

                if (first.dateTime < second.dateTime) {
                    return 1;
                }

                return 0;
            });
    }

    private setProperties() {
        this.startOffset = new Date(this.eventService.currentYear, this.eventService.currentMonth - 1).getDay();
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
        this.setStyleVariables();
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
        this.setStyleVariables();
    }

    cellClicked(day: number) {
        this.selectedDay = day;
    }

    showDialog() {
        if (this.dialog.openDialogs.length > 0) {
            return;
        }

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();

        let date: Date;

        if (currentYear === this.eventService.currentYear && currentMonth === this.eventService.currentMonth && currentDay === this.selectedDay) {
            date = new Date();
        } else {
            date = new Date(this.eventService.currentYear, this.eventService.currentMonth - 1, this.selectedDay, this.defaultHour, this.defaultMinute);
        }

        this.dialog.open(CreateEventFormComponent, {data: {title: null, date: date}});
    }

    protected setStyleVariables() {
        const verticalCount = Math.ceil((this.startOffset + this.dayCount) / 7);
        const height = Math.floor(
            (window.innerHeight - this.cells.nativeElement.getBoundingClientRect().top) / verticalCount);

        this.cells.nativeElement.style.setProperty('--vertical-count', verticalCount.toString());
        this.cells.nativeElement.style.setProperty('--height', `${height}px`);
    }
}
