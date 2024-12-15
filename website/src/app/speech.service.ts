import {Injectable, signal} from '@angular/core';
import {CalendarEvent} from "./calendarEvent";

@Injectable({
    providedIn: 'root'
})
export class SpeechService {

    private readonly recognition: any;
    private started = false;
    private receivedOutputSinceStarted = false;

    success = signal<CalendarEvent | null>(null);
    error = signal('');

    constructor() {
        const recognition = (window as any)['SpeechRecognition'] || (window as any)['webkitSpeechRecognition'];

        if (recognition === null || recognition === undefined) {
            return;
        }

        this.recognition = new recognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        this.recognition.onspeechend = this.speechEnd.bind(this);
        this.recognition.onresult = this.result.bind(this);
    }

    isAvailable() {
        return this.recognition != null;
    }

    start() {
        if (!this.isAvailable()) {
            this.error.set('The Web Speech API isn\'t supported on this browser.');
            return;
        }

        if (this.started) {
            return;
        }

        this.started = true;
        this.receivedOutputSinceStarted = false;
        this.recognition.start();
    }

    private speechEnd() {
        this.recognition.stop();

        this.started = false;

        if (!this.receivedOutputSinceStarted) {
            this.error.set('No speech was detected.');
        }
    }

    private result(event: any) {
        this.receivedOutputSinceStarted = true;
        this.success.set(event.results[0][0].transcript);
    }
}
