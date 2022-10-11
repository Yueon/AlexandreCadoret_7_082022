import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { tap } from "rxjs";
import { UserService } from "src/app/services/user.service";
import { UserModel } from "src/app/interfaces/user";
import { PostComponent } from "src/app/components/post/post.component";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    user!: UserModel;
    constructor(private userService: UserService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();
    }

    displayForm() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "600px";
        dialogConfig.maxWidth = "80%";
        dialogConfig.hasBackdrop = true;
        this.dialog.open(PostComponent, dialogConfig);
    }
}