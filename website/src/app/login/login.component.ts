import {Component, ViewChild} from '@angular/core';
import {CredentialFormComponent} from "../credential-form/credential-form.component";
import {Router, RouterLink} from "@angular/router";
import {EventService} from "../event.service";

@Component({
    selector: 'app-login',
    imports: [
        CredentialFormComponent,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    @ViewChild('loginForm') loginForm!: CredentialFormComponent;

    constructor(private router: Router, private eventService: EventService) {
    }

    async login(data: { email: string; password: string }) {
        if (await this.eventService.login(data.email, data.password)) {
            await this.router.navigate(['']);
            return;
        }

        this.loginForm.errors = ['Could not log in. Please check your email & password, then try again.'];
    }
}
