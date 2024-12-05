import {Component} from '@angular/core';
import {CredentialFormComponent} from "../credential-form/credential-form.component";

@Component({
    selector: 'app-login',
    imports: [
        CredentialFormComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

}
