import {ApplicationRef, Injectable, signal} from '@angular/core';
import {AiService} from "./ai.service";

@Injectable({
    providedIn: 'root'
})
export class SpeechService {

    private readonly recognition: any;
    private speechRunning = false;
    private receivedOutputSinceStarted = false;

    submittingToAi = false;

    success = signal<{ title: string, dateTime: Date } | null>(null);
    error = signal('');

    constructor(private aiService: AiService, private applicationRef: ApplicationRef) {
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
        this.recognition.onerror = this.onError.bind(this);
    }

    isAvailable() {
        return this.recognition != null;
    }

    start() {
        if (!this.isAvailable()) {
            this.error.set('The Web Speech API isn\'t supported on this browser.');
            return;
        }

        if (this.speechRunning || this.submittingToAi) {
            return;
        }

        this.speechRunning = true;
        this.receivedOutputSinceStarted = false;
        this.submittingToAi = false;
        this.success.set(null);
        this.error.set('');
        this.recognition.start();
    }

    private speechEnd() {
        this.recognition.stop();

        this.speechRunning = false;

        if (!this.receivedOutputSinceStarted) {
            this.error.set('No speech was detected.');
        }
    }

    private result(event: any) {
        this.receivedOutputSinceStarted = true;
        this.submittingToAi = true;

        this.applicationRef.tick();

        this.aiService.generate(event.results[0][0].transcript).then(data => {
            this.submittingToAi = false;
            this.applicationRef.tick();

            if (data === null) {
                this.error.set('An error occurred while parsing the speech with the AI. Please try again later.');
                return;
            }

            this.success.set(data);
        });
    }

    private onError(event: { error: string }) {
        this.speechRunning = false;

        if (event.error === 'no-speech') {
            this.error.set('No speech was detected. Please try again.');
            return;
        }

        if (event.error === 'not-allowed') {
            this.error.set('Please allow the webpage access to the microphone if you want to use this feature.');
            return;
        }

        this.error.set(`An unknown error '${event.error}' occurred... Please try again later.`)
    }
}
