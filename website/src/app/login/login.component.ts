import {Component} from '@angular/core';
import {CredentialFormComponent} from "../credential-form/credential-form.component";
import {RouterLink} from "@angular/router";

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

}
