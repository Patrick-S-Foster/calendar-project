import {Component, Input} from '@angular/core';
import {CalendarEvent} from "../calendarEvent";
import {MatDialog} from "@angular/material/dialog";
import {EventOverviewComponent} from "../event-overview/event-overview.component";

@Component({
    selector: 'app-cell',
    imports: [],
    templateUrl: './cell.component.html',
    styleUrl: './cell.component.scss'
})
export class CellComponent {

    @Input({required: true}) number = 0;
    @Input({required: true}) events: CalendarEvent[] = [];
    @Input({required: true}) selected = false;

    constructor(private dialog: MatDialog) {
    }

    openOverview(event: CalendarEvent) {
        this.dialog.open(EventOverviewComponent, {data: event});
    }
}
