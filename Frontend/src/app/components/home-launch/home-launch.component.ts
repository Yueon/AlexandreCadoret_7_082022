import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { tap } from "rxjs";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/interfaces/user";

@Component({
    selector: "app-home-launch",
    template: ` <app-home></app-home> `,
    styles: [],
})
export class HomeLaunchComponent implements OnInit {
    user: User | undefined;
    constructor(private userService: UserService, private authService: AuthService) {}

    ngOnInit(): void {
        const id = this.authService.getUserId();
        this.userService.getUserById(id);
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();
    }
}
