import {Component, effect, Inject, OnInit} from '@angular/core';
import {SpeechService} from "../speech.service";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatError} from "@angular/material/form-field";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ComponentType} from "@angular/cdk/portal";

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

    constructor(protected speechService: SpeechService, private dialogRef: MatDialogRef<SpeechInputComponent>,
                private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data: {
            openType: ComponentType<unknown>,
            id: number | null,
            flag: boolean
        }) {
        effect(() => {
            const event = this.speechService.success();

            if (event === null) {
                return;
            }

            this.dialogRef.close();
            this.dialog.open(data.openType, {
                data: {
                    id: data.id,
                    title: event.title,
                    dateTime: event.dateTime,
                    flag: data.flag
                }
            })
        });
    }

    ngOnInit(): void {
        this.start();
    }

    protected start() {
        this.speechService.start();
    }

}
