import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {EventService} from "./event.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

    constructor(private router: Router, private eventService: EventService) {
    }

    async canActivate() {
        if (this.eventService.loggedIn) {
            return true;
        } else {
            await this.router.navigate(['/login']);
            return false;
        }
    }
}