import {Component} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {EventService} from "../event.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    imports: [
        MatToolbar,
        MatButton
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

    constructor(private router: Router, protected eventService: EventService) {
    }

    async logout() {
        await this.eventService.logout();
        await this.router.navigate(['login']);
    }
}
