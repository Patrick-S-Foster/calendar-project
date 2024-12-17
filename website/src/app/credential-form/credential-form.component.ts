import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-credential-form',
    imports: [
        FormsModule,
        MatFormField,
        MatFormFieldModule,
        MatInput,
        ReactiveFormsModule,
        MatIconButton,
        MatIcon,
        MatButton,
        MatProgressSpinner
    ],
    templateUrl: './credential-form.component.html',
    styleUrl: './credential-form.component.scss'
})
export class CredentialFormComponent {
    protected readonly email = new FormControl('', [Validators.required, Validators.email]);
    protected readonly password = new FormControl('', [Validators.required]);

    private _errors: string[] = [];

    protected emailErrorMessage = signal('');
    protected hidePassword = signal(true);
    protected submitting = false;

    @Input({required: true}) title = '';
    @Input({required: true}) submitButtonText = '';
    @Output() submitForm = new EventEmitter<{ email: string, password: string }>();

    public get errors() {
        return this._errors;
    }

    public set errors(errors: string[]) {
        this.submitting = false;
        this._errors = errors;
    }

    protected updateEmailErrorMessage() {
        if (this.email.hasError('required')) {
            this.emailErrorMessage.set('You must enter a value');
        } else if (this.email.hasError('email')) {
            this.emailErrorMessage.set('Not a valid email');
        } else {
            this.emailErrorMessage.set('');
        }
    }

    protected togglePasswordVisibility($event: any) {
        if ($event.pointerType === 'mouse') {
            this.hidePassword.set(!this.hidePassword());
        }
    }

    protected submit(event: Event) {
        event.preventDefault();

        if (this.submitting) {
            return;
        }

        if (this.email.invalid || this.email.value === null || this.password.value === null) {
            this.updateEmailErrorMessage();
            return;
        }

        this.submitting = true;
        this._errors = [];
        this.submitForm.emit({email: this.email.value, password: this.password.value});
    }
}
