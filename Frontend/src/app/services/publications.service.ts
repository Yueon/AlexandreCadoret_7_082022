import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, mapTo, Observable, of, throwError } from "rxjs";
import { PostModel } from "src/app/interfaces/posts";
import { environment } from "src/environments/environment";
import { HttpResponse } from "../interfaces/http-response";
import { MessagesService } from "./messages.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {
  nbComments: any;
  content: any;
  private postsUrl = `${environment.backendServer}/api/post`;

  constructor(
    private HttpClient: HttpClient,
    private router: Router,
    private messagesService: MessagesService,
    private auth: AuthService,
  ) { }


  private log(message: string): void {
    this.messagesService.add(message);
  }


public newPublication(formData: FormData): Observable<HttpResponse> {
  return this.HttpClient.post(`${this.postsUrl}`, formData, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      this.log(`Erreur: ${err.statusText}`);
      return of(err);
    }));
}

deletePublication(id: any): Observable<HttpResponse> {
  return this.HttpClient.delete(`${this.postsUrl}/${id}`, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      this.log(`Erreur: ${err.statusText}`);
      return of(err);
    }));
}

updatePublication(id: any, formData: FormData): Observable<HttpResponse> {
  return this.HttpClient.put(`${this.postsUrl}/${id}`, formData, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      this.log(`Erreur: ${err.statusText}`);
      return of(err);
    }));
}

getPublications() {
  return this.HttpClient.get<PostModel[]>(this.postsUrl + "/")
}

getOnePublication(id: number): Observable<HttpResponse> {
  return this.HttpClient.get(`${this.postsUrl}/${id}`, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      this.log(`Erreur: ${err.statusText}`);
      return of(err);
    }));
}

likePost(id: string, like: number) {
  return this.HttpClient.post<{ message: string }>(
    'http://localhost:3000/api/post/' + id + '/like',
    { userId: this.auth.getUserId(), like: like}
  ).pipe(
    mapTo(like),
    catchError(error => throwError(error.error.message))
  );
}
}
