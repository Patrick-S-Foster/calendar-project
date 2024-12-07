import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {AuthenticationGuard} from "./authentication.guard";

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: '', component: CalendarComponent, canActivate: [AuthenticationGuard]},
];
