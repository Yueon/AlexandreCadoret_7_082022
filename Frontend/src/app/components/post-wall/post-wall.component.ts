import { Component, Inject, OnInit } from "@angular/core";
import { BehaviorSubject, forkJoin, fromEvent, map, Observable, take, tap } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from 'src/app/services/auth.service';
import { PublicationsService } from 'src/app/services/publications.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';

import { PostModel } from 'src/app/interfaces/posts'; 
import { UserModel } from "src/app/interfaces/user";
import { HttpResponse } from 'src/app/interfaces/http-response';
import { UpdatePostComponent } from "../update-post/update-post.component";

@Component({
  selector: 'app-post-wall',
  templateUrl: './post-wall.component.html',
  styleUrls: ['./post-wall.component.scss']
})
export class PostWallComponent implements OnInit {

  loading!: boolean;
  currentPage: any = '';
  pageSize: any = '';
  obsArrayContent: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  content$: Observable<any> = this.obsArrayContent.asObservable();
  like: boolean | undefined;
  user: UserModel | undefined;
  userid: string | undefined;
  postId!: any;
  post!: PostModel;
  posterId!: string;

  constructor(
    private publicationsService: PublicationsService,
    public authService: AuthService,
    private messagesService: MessagesService,
    public userService: UserService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: any,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log("je suis les post",this.content$)
    this.loading = true;
    this.userService.user$
      .pipe(
        tap((user) => {
          this.user = user;
        })
      )
      .subscribe();
    
      this.userid = this.authService.getUserId();
      console.log('userid:', this.userid)
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.publicationsService
        .getPublications(this.currentPage, this.pageSize)
        .pipe(
          tap(() => {
            this.loading = false;
          })
        )
        .subscribe((data) => {
          this.obsArrayContent.next(data);
        });
}

public onlike(event: Event): void {
  const postId = this.postId;
  console.log('postId', postId)
}


public onDeletePublication(post: any, index: number): void {
  console.log(post._id, "oui")
  console.log("index", index)
  this.publicationsService.deletePublication(post._id).subscribe(() => {
    this.content$
      .pipe(
        take(1),
        map((data: any) => {
          let newData = [];
          for (let content of data) {
            content.posterId._id !== post.posterId._id ? newData.push(content) : null;
          }
          return newData
        })
      )
      .subscribe((data) => {
        this.obsArrayContent.next(data);
    });
  })
}

modifyPost(post: any) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width = "600px";
  dialogConfig.maxWidth = "80%";
  dialogConfig.data = post;

  this.dialog.open(UpdatePostComponent, dialogConfig);
}
}
