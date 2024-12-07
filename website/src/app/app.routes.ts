import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {AuthenticationGuard} from "./authentication.guard";
import {ReverseAuthenticationGuard} from "./reverse-authentication.guard";

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [ReverseAuthenticationGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [ReverseAuthenticationGuard]},
    {path: '', component: CalendarComponent, canActivate: [AuthenticationGuard]},
];
