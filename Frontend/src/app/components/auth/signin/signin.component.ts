import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { HttpResponse } from '../../../interfaces/http-response';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  //public signInForm: FormGroup;

  constructor(
    public signInForm: FormGroup,
    private authService: AuthService,
    private formBuilder: FormBuilder,
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
          this.authService.loginUser(email, password);
        }
      })
  }

}
