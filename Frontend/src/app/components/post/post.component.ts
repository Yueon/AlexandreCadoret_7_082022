import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { catchError, distinctUntilChanged, Observable, tap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

import { PublicationsService } from 'src/app/services/publications.service';
import { HttpResponse } from 'src/app/interfaces/http-response';
import { MessagesService } from "../../services/messages.service";
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from '../../interfaces/user'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postForm!: FormGroup;
  selectedFile: File | undefined;
  url: any = "";
  User!: UserModel;
  userId!: any;
  user$!: Observable<UserModel>;

  constructor(
    private formBuilder: FormBuilder,
    private PublicationsService: PublicationsService,
    private router: Router,
    private dialog: MatDialog,
    private messagesService: MessagesService,
    public authService: AuthService,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userService.user$
      .pipe(
        tap((User) => {
          this.User = User;
        })
      )
      .subscribe();
    this.postForm = this.formBuilder.group({
        content: [null, [Validators.required, Validators.maxLength(1000)]],
        file: [null, [Validators.required]],
    });
    this.setContentValidators();

    document.getElementById("label")?.classList.remove("d-none");
    document.getElementById("remove-btn")?.classList.add("d-none");
  }

  createPost() {
    const content = this.postForm.get("content")!.value;
    console.log('content', content);
    const picture = this.postForm.get("file")!.value;
    console.log('picture', picture);
    console.log('url', this.url);
    const posterId = this.userId;
    console.log('posterId', this.userId);
    const posterPseudo = this.User.pseudo;
    console.log('poster', this.User);
    console.log('posterPseudo', this.User.pseudo);
    // faire appel au userId dans le ngOnInit et le recup la avec le pseudo
    const formData = new FormData();
    console.log("formData", formData)
    if (picture !== null) {
        formData.append('picture', this.url);
    }
    formData.append('content', content);
    formData.append('posterId', posterId);
    formData.append('posterPseudo', posterPseudo);
    
    this.PublicationsService
        .newPublication(formData)
        .pipe(
            tap(() => {
                this.router.navigateByUrl("", { skipLocationChange: true}).then(() => {
                    this.router.navigate(["/home"]);
                });
                this.postForm.patchValue({ content: ""});
                this.postForm.patchValue({ file: undefined});
                this.url = "";
                this.dialog.closeAll();
            })
        )
        .subscribe();
  }

  setContentValidators() {
    const content = this.postForm.get("content");
    const file = this.postForm.get("file");
    this.postForm
        .get("content")
        ?.valueChanges.pipe(distinctUntilChanged())
        .subscribe((content) => {
            if (content !== null) {
                file?.setValidators(null);
            } else {
                file?.setValidators(Validators.required);
            }
            file?.updateValueAndValidity();
        });
    this.postForm
        .get("file")
        ?.valueChanges.pipe(distinctUntilChanged())
        .subscribe((file) => {
            if (file !== null) {
                content?.setValidators(null);
            } else {
                content?.setValidators(Validators.required);
            }
            content?.updateValueAndValidity();
        });
  }

  addFile($event: any) {
    this.selectedFile = $event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL($event.target.files[0]);
    reader.onload = (event: any) => {
        this.url = event.target.result;
    };

    document.getElementById("label")?.classList.add("hidden");
    document.getElementById("remove-btn")?.classList.remove("hidden");
  }

  removeFile() {
    this.postForm.patchValue({ content: null });
    this.postForm.patchValue({ file: null });
    const content = this.postForm.get("content");

    this.selectedFile = undefined;
    this.url = "";
    document.getElementById("label")?.classList.remove("hidden");
    document.getElementById("remove-btn")?.classList.add("hidden");
}

onClose() {
    this.dialog.closeAll();
}

closeTab() {
    this.onClose();
}
}
