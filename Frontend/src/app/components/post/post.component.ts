import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { catchError, distinctUntilChanged, EMPTY, tap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

import { PublicationsService } from 'src/app/services/publications.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postForm!: FormGroup;
  leftCharLength?: number;
  selectedFile: File | undefined;
  url: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private PublicationsService: PublicationsService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.leftCharLength = 70;
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
    const file = this.postForm.get("file")!.value;
    let postContent;
    this.selectedFile ? (postContent = this.selectedFile) : (postContent = content);

    this.PublicationsService
        .createPost(postContent)
        .pipe(
            tap(() => {
                this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
                });
                this.postForm.patchValue({ content: "" });

                this.selectedFile = undefined;
                this.url = "";
            }),
            catchError((error) => {
                this.postForm.patchValue({ content: "" });

                this.selectedFile = undefined;
                this.url = "";
                return EMPTY;
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
