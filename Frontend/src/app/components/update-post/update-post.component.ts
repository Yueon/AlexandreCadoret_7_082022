import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss']
})
export class UpdatePostComponent implements OnInit {
  modifyForm!: FormGroup;
  urlFile!: string;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.modifyForm = new FormGroup({
      content: new FormControl(this.data.content),
      file: new FormControl(""),
  });
  if (this.data.content.includes("post_picture")) {
    this.urlFile = this.data.content;
} else {
    this.urlFile = "";
}
  }


onClose() {
    this.dialog.closeAll();
}
closeTab() {
    this.onClose();
}
}
