import {Component} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {EventService} from "../event.service";

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

    constructor(protected eventService: EventService) {
    }

    async logout() {
        return this.eventService.logout();
    }
}
