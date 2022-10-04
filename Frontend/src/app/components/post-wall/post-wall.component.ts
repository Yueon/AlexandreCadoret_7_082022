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

@Component({
  selector: 'app-post-wall',
  templateUrl: './post-wall.component.html',
  styleUrls: ['./post-wall.component.scss']
})
export class PostWallComponent implements OnInit {

  loading!: boolean;
  stillPost!: boolean;
  currentPage: any = '';
  pageSize: any = '';
  obsArrayContent: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  content$: Observable<any> = this.obsArrayContent.asObservable();
  like: boolean | undefined;
  user: UserModel | undefined;
  userid: string | undefined;

 // posts!: PostModel[];

  constructor(
    private publicationsService: PublicationsService,
    public authService: AuthService,
    private messagesService: MessagesService,
    public userService: UserService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: any,
    private activitedRoute: ActivatedRoute,
    private route: Router
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
      this.route.routeReuseStrategy.shouldReuseRoute = function () {
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

  deletePost(): void {
   
}

  modifyPost(post: any) {
}
}
