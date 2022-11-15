import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, EMPTY, Observable, tap } from "rxjs";

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MessagesService } from 'src/app/services/messages.service';

import { HttpResponse } from '../../interfaces/http-response';
import { UserModel } from '../../interfaces/user'


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  User!: UserModel;
  userId!: any;
  url!: string;
  user$!: Observable<UserModel>;
  passwordChangeForm!: FormGroup;
  selectedFile: HTMLInputElement | undefined;
  errorMsg!: string;
  descriptionForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public messageService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userService.user$
      .pipe(
        tap((User) => {
          this.User = User;
          this.url = this.User.image;
        })
      )
      .subscribe();
    this.descriptionForm = this.formBuilder.group({
      bio: new FormControl(),
    });
    this.initForm();
  }
  private initForm(): void {
    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
    });
  }
  onselectFile(event: any) {
    this.selectedFile = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
        this.url = event.target.result;
    };
  }

  public saveProfil(): void {
    let image: any;
    this.selectedFile ? (image = this.selectedFile) : (image = this.url);
    const uploadData = new FormData();
    uploadData.append('image', image);
    console.log("image", image)
    uploadData.append('user', this.userId);
    this.userService.updateImage(this.userId, uploadData)
      .pipe(
        tap(() => {
          this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
            this.router.navigate(["/home"]);
          });
        })
      )
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          this.User;
        } else {
          this.messageService.add(`Une erreur s'est produite`);
        }
      });
  }

  public onUpdatedescription() {
    const bio = this.descriptionForm?.get("bio")!.value;
    console.log("bio:", bio);
    const formData = new FormData();
    formData.append('bio', bio);
    console.log("bio:", formData);
      this.userService.updateDescription(this.userId, bio)
      .pipe(
        tap(() => {
          this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
            this.router.navigate(["/home"]);
          });
        })
      )
        .subscribe()
    }

    public onDeleteClicked(): void {
      document.getElementById('delete-confirm')?.classList.toggle('profile-delete-confirm__hidden');
    }
    public onDeleteConfirmed(): void {
      this.userService.deleteUser(this.userId)
      .pipe(
        tap(() => {
          this.authService.logout();
          this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
            this.router.navigate(["/login"]);
          });
        })
      )
        .subscribe()
    }
    }