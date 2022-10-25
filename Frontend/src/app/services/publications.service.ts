import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, of } from "rxjs";
import { PostModel } from "src/app/interfaces/posts";
import { environment } from "src/environments/environment";
import { HttpResponse } from "../interfaces/http-response";
import { MessagesService } from "./messages.service";

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

deletePublication(id: number): Observable<HttpResponse> {
  return this.HttpClient.delete(`${this.postsUrl}/${id}`, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      this.log(`Erreur: ${err.statusText}`);
      return of(err);
    }));
}

getPublications(pageNumber: number, pageSize: number) {
  return this.HttpClient.get<PostModel[]>(this.postsUrl + "/" + pageNumber + pageSize)
}

getOnePublication(id: number): Observable<HttpResponse> {
  return this.HttpClient.get(`${this.postsUrl}/${id}`, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      this.log(`Erreur: ${err.statusText}`);
      return of(err);
    }));
}
}
