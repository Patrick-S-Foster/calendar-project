import {Component, Input} from '@angular/core';
import {CalendarEvent} from "../calendarEvent";

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

}
