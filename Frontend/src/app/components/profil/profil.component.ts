import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

import { HttpResponse } from '../../interfaces/http-response';
import { UserModel } from '../../interfaces/user'
import { Observable, tap } from 'rxjs';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  User!: UserModel;
  userId!: string;
  url!: string;
  user$!: Observable<UserModel>;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log("userId", this.userId);
    this.userService.user$
      .pipe(
        tap((User) => {
          this.User = User;
          this.url = this.User.image;
        })
      )
      .subscribe();
  }

}
