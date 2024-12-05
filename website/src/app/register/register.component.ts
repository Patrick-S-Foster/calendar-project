import {Component, ViewChild} from '@angular/core';
import {CredentialFormComponent} from "../credential-form/credential-form.component";
import {Router} from "@angular/router";
import {EventService} from "../event.service";

@Component({
    selector: 'app-register',
    imports: [
        CredentialFormComponent
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

    @ViewChild('registerForm') registerForm!: CredentialFormComponent;

    constructor(private router: Router, private eventService: EventService) {
    }

    async submitForm(data: { email: string; password: string }) {
        const errors = await this.eventService.register(data.email, data.password);

        if (errors.length > 0) {
            this.registerForm.errors = errors;
            return;
        }

        await this.router.navigate(['login']);
    }
}
