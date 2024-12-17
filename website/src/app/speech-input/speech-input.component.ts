import {Component, effect, OnInit} from '@angular/core';
import {SpeechService} from "../speech.service";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialog, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatError} from "@angular/material/form-field";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CreateEventFormComponent} from "../create-event-form/create-event-form.component";

@Component({
    selector: 'app-speech-input',
    imports: [
        MatIconButton,
        MatDialogClose,
        MatIcon,
        MatError,
        MatButton,
        MatProgressSpinner
    ],
    templateUrl: './speech-input.component.html',
    styleUrl: './speech-input.component.scss'
})
export class SpeechInputComponent implements OnInit {

    constructor(protected speechService: SpeechService, private dialogRef: MatDialogRef<SpeechInputComponent>, private dialog: MatDialog) {
        effect(() => {
            const event = this.speechService.success();

            if (event === null) {
                return;
            }

            this.dialogRef.close();
            this.dialog.open(CreateEventFormComponent, {data: {title: event.title, date: event.dateTime}})
        });
    }

    ngOnInit(): void {
        this.start();
    }

    protected start() {
        this.speechService.start();
    }

}
