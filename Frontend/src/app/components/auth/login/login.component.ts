import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { catchError, EMPTY, tap } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

signInForm!: FormGroup
errorMsg!: string;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
    });
  }

  public onSubmit(): void {
    const { email, password } = this.signInForm.value;
    this.authService.loginUser(email, password)
    .pipe(
      tap(() => {
        const id = this.authService.getUserId();

        this.userService.getUserById(id)
        this.router.navigate(['/home']);
      }),
      catchError((error) => {
        this.errorMsg = error.error.error;
        return EMPTY;
      })
    )
    .subscribe(res => {
      console.log(res)
      localStorage.setItem('token', res.token)
      localStorage.setItem('userId', res.userId)
    });
  }
}
