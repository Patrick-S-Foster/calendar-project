import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {CalendarEvent} from "../calendarEvent";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from "@angular/material/timepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS} from "@angular/material/core";
import {CustomDateAdapter} from "../create-event-form/CustomDateAdapter";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {EventService} from "../event.service";

@Component({
    selector: 'app-event-overview',
    imports: [
        MatIconButton,
        MatDialogClose,
        MatIcon,
        FormsModule,
        MatFormField,
        ReactiveFormsModule,
        MatInput,
        MatLabel,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatHint,
        MatSuffix,
        MatTimepicker,
        MatTimepickerInput,
        MatTimepickerToggle,
        MatButton,
        MatError,
        MatProgressSpinner
    ],
    providers: [
        {provide: DateAdapter, useClass: CustomDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
    ],
    templateUrl: './event-overview.component.html',
    styleUrl: './event-overview.component.scss'
})
export class EventOverviewComponent {

    editing = false;
    submitting = false;
    submitFailed = false;
    title: FormControl<string | null>;
    dateTime: FormControl<Date | null>;

    constructor(@Inject(MAT_DIALOG_DATA) protected calendarEvent: CalendarEvent, private eventService: EventService,
                private dialogRef: MatDialogRef<EventOverviewComponent>) {
        this.title = new FormControl(calendarEvent.title, [Validators.required]);
        this.dateTime = new FormControl(calendarEvent.dateTime, [Validators.required]);
    }

    edit() {
        this.editing = true;
    }

    async submit($event: Event) {
        $event.preventDefault();

        if (this.submitting || this.title.invalid || this.dateTime.invalid) {
            return;
        }

        this.submitting = true;
        this.submitFailed = false;

        if (await this.eventService.update(this.calendarEvent.id, this.title.value!, this.dateTime.value!)) {
            this.dialogRef.close();
            return;
        }

        this.submitting = false;
        this.submitFailed = true;
    }

    cancel() {
        this.editing = false;
    }

    async delete() {
        this.dialogRef.close();
        await this.eventService.delete(this.calendarEvent.id);
    }
}
