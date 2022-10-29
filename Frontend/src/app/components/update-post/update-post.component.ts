import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormGroup } from "@angular/forms";
import { catchError, EMPTY, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PublicationsService } from 'src/app/services/publications.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss']
})
export class UpdatePostComponent implements OnInit {
  modifyForm!: FormGroup;
  modifFile: File | undefined;
  urlFile!: string;

  constructor(
    private publicationService: PublicationsService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('data', this.data)
    this.modifyForm = new FormGroup({
      content: new FormControl(this.data.content),
      file: new FormControl(""),
  });
  if (this.data.picture !== '') {
    this.urlFile = this.data.picture;
} else {
    this.urlFile = "";
}
  }

get content() {
  return this.modifyForm.controls["content"];
}
get file() {
  return this.modifyForm.controls["file"];
}
onClose() {
    this.dialog.closeAll();
}
closeTab() {
    this.onClose();
    console.log('hello')
}
modifyPost() {
  const id = this.data._id;
  const content = this.modifyForm.get("content")!.value;
  const picture = this.modifyForm.get("file")!.value;
  console.log("id", id)
  console.log("content", content)
  console.log("picture", picture)
  console.log('url', this.urlFile);
  const formData = new FormData();
  if (picture !== null) {
    formData.append('picture', this.urlFile);
  }
  formData.append('content', content);
  this.publicationService
      .updatePublication(id, formData)
      .pipe(
          tap(() => {
              this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
                this.router.navigate(["/home"]);
              });
              this.urlFile = "";
              this.closeTab();
          }),
      )
      .subscribe();
}
addFile($event: any) {
  this.modifFile = $event.target.files[0];
  let reader = new FileReader();
  reader.readAsDataURL($event.target.files[0]);
  reader.onload = (event: any) => {
      this.urlFile = event.target.result;
  };

  document.getElementById("label")?.classList.add("hidden");
  document.getElementById("remove-btn")?.classList.remove("hidden");
}

removeFile(index: any) {
  this.modifFile = undefined;
  this.urlFile = "";
  document.getElementById("label")?.classList.remove("hidden");
  document.getElementById("remove-btn")?.classList.add("hidden");
}
}
