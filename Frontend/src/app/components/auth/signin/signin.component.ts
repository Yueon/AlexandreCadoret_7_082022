import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { HttpResponse } from '../../../interfaces/http-response';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

signInForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private messagesService: MessagesService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.signInForm = this.formBuilder.group({
      pseudo: ['', [Validators.required, Validators.pattern(/[A-Za-zÀ-ÖØ-öø-ÿ ]{3,50}/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
    })
  }

  public onSubmit(): void {
    const pseudo: string = this.signInForm.get('pseudo')?.value;
    const email: string = this.signInForm.get('email')?.value;
    const password: string = this.signInForm.get('password')?.value;
    this.authService.createUser(pseudo, email, password)
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          this.authService.loginUser(email, password)
          .subscribe(res => {
            console.log(res)
            localStorage.setItem('token', res.token)
            localStorage.setItem('userId', res.userId)
            this.router.navigate(['/home']);
          });
        } else {
          this.messagesService.add(`Erreur: ${response.error.error}`);
        }
      })
  }

}
