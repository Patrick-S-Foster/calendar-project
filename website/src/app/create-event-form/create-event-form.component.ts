import {Component, Inject} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MAT_NATIVE_DATE_FORMATS,
    MatNativeDateModule
} from "@angular/material/core";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {CustomDateAdapter} from "./CustomDateAdapter";
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from "@angular/material/timepicker";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {EventService} from "../event.service";
import {SpeechService} from "../speech.service";

@Component({
    selector: 'app-create-event-form',
    imports: [
        MatIconButton,
        MatIcon,
        FormsModule,
        MatFormField,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInput,
        MatDatepicker,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogClose,
        MatTimepicker,
        MatTimepickerToggle,
        MatTimepickerInput,
        MatButton,
        MatProgressSpinner
    ],
    providers: [
        {provide: DateAdapter, useClass: CustomDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
    ],
    templateUrl: './create-event-form.component.html',
    styleUrl: './create-event-form.component.scss'
})
export class CreateEventFormComponent {

    private readonly millisecondsPerHour = 3600000;

    title = new FormControl('', [Validators.required]);
    start: FormControl<Date | null>;
    end: FormControl<Date | null>;
    submitting = false;
    submitFailed = false;

    constructor(private eventService: EventService, private dialogRef: MatDialogRef<CreateEventFormComponent>,
                @Inject(MAT_DIALOG_DATA) data: Date, protected speechService: SpeechService) {
        this.start = new FormControl(data, [Validators.required]);
        this.end = new FormControl(new Date(data.getTime() + this.millisecondsPerHour), [Validators.required])
    }

    async submit($event: Event) {
        $event.preventDefault();

        if (this.submitting || this.title.invalid || this.start.invalid || this.end.invalid) {
            return;
        }

        this.submitting = true;
        this.submitFailed = false;

        const title = this.title.value;
        const start = this.start.value;
        const end = this.end.value;

        if (title === null || start === null || end === null) {
            return;
        }

        if (await this.eventService.create(title, start, end)) {
            this.dialogRef.close();
            return;
        }

        this.submitFailed = true;
        this.submitting = false;
    }

    speechToEvent() {
        // TODO: implement
    }
}
