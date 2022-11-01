import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { tap } from "rxjs";

import { UserModel } from 'src/app/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: UserModel | undefined;
  
  constructor(
    public authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.user$
        .pipe(
            tap((user) => {
                this.user = user;
            })
        )
        .subscribe();
  }

  public onLogout(): void {
    this.authService.logout();
  }

}
