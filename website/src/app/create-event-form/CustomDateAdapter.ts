import {NativeDateAdapter} from "@angular/material/core";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CustomDateAdapter extends NativeDateAdapter {
    override getFirstDayOfWeek(): number {
        return 0;
    }
}