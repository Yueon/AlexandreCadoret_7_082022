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
  }
  onselectFile(event: any) {
    this.selectedFile = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
        this.url = event.target.result;
    };
  }

  /*saveProfil() {
    let image;
    this.selectedFile ? (image = this.selectedFile) : (image = this.url);
    console.log("image", image);
    this.userService
        .updateUser(this.userId, image)
        .pipe(
            tap(() => {
                this.userService.getUserById(this.userId);

                this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
                    this.router.navigate(["/home"]);
                });
            }),
            catchError((error) => {
                this.errorMsg = error.error.message;
                return EMPTY;
            })
        )
        .subscribe();
  }*/

  /*public saveProfil(): void {
    let image: any;
    this.selectedFile ? (image = this.selectedFile) : (image = this.url);
    console.log('image', image)
    console.log('ID', this.userId)
    const uploadData = new FormData();
    console.log('data',uploadData)
    uploadData.append('image', image);
    console.log('data',uploadData)
    this.userService.updateImage(this.userId, uploadData)
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          this.User;
        } else {
          this.messageService.add(`Une erreur s'est produite`);
        }
      });
  }*/

  public onUpdatedescription() {
    const Bio = this.descriptionForm?.get("bio")!.value;
    const formData = new FormData();
    formData.append('bio', Bio);
      this.userService.updateDescription(this.userId, formData)
        .subscribe()
    }
}
