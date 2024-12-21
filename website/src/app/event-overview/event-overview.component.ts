import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
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
import {SpeechService} from "../speech.service";
import {SpeechInputComponent} from "../speech-input/speech-input.component";

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
    date: FormControl<Date | null>;
    time: FormControl<Date | null>;

    constructor(@Inject(MAT_DIALOG_DATA) protected calendarEvent: {
                    id: number,
                    title: string | null,
                    dateTime: Date,
                    flag: boolean
                }, private eventService: EventService, private dialogRef: MatDialogRef<EventOverviewComponent>,
                protected speechService: SpeechService, private dialog: MatDialog) {
        this.title = new FormControl(calendarEvent.title, [Validators.required]);
        this.date = new FormControl(calendarEvent.dateTime, [Validators.required]);
        this.time = new FormControl(calendarEvent.dateTime, [Validators.required]);
        this.editing = calendarEvent.flag;
    }

    edit() {
        this.editing = true;
    }

    async submit($event: Event) {
        $event.preventDefault();

        if (this.submitting || this.title.invalid || this.date.invalid || this.time.invalid) {
            return;
        }

        this.submitting = true;
        this.submitFailed = false;

        const dateTime = new Date(
            this.date.value!.getFullYear(),
            this.date.value!.getMonth(),
            this.date.value!.getDate(),
            this.time.value!.getHours(),
            this.time.value!.getMinutes());

        if (await this.eventService.update(this.calendarEvent.id, this.title.value!, dateTime)) {
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

    speechToEvent() {
        this.dialogRef.close();
        this.dialog.open(SpeechInputComponent, {
            data: {
                openType: EventOverviewComponent,
                id: this.calendarEvent.id,
                flag: true
            }
        });
    }
}
