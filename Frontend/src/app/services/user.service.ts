import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserModel } from "src/app/interfaces/user";
import { environment } from "src/environments/environment";
import { HttpResponse } from "../interfaces/http-response";
import { MessagesService } from "./messages.service";

@Injectable({
    providedIn: "root",
})
export class UserService {
    user$ = new BehaviorSubject<any>([]);
    private backendServer = environment.backendServer;
    constructor(
      private http: HttpClient, 
      public messageService: MessagesService,
      ) {}

    getUserById(id: any) {
        this.http
            .get<UserModel>(this.backendServer + "/api/auth/" + id)
            .pipe(
                tap((UserModel) => {
                    this.user$.next(UserModel);
                })
            )
            .subscribe();
    }

    public updateImage(id: number, uploadData: FormData): Observable<HttpResponse> {
        return this.http.put(`${this.backendServer}/api/auth/${id}`, uploadData, { withCredentials: true, observe: 'response' })
          .pipe(catchError(err => {
            this.log(`Erreur: ${err.statusText}`);
            return of(err);
          }));
      }
      private log(message: string): void {
        this.messageService.add(message);
      }


    getAllUser() {
        return this.http.get<[UserModel]>(this.backendServer + "/api/auth");
    }

    public deleteUser(id: number): Observable<HttpResponse> {
      return this.http.delete(this.backendServer + "/api/auth/" + id, { withCredentials: true, observe: 'response' })
        .pipe(catchError(err => {
          this.log(`Erreur: ${err.statusText}`);
          return of(err);
        }));
    }

    public updateDescription(id: number, bio: String): Observable<HttpResponse> {
      console.log("ok", bio)
        return this.http.put(`${this.backendServer}/api/auth/${id}`, {bio}, { withCredentials: true, observe: 'response' })
          .pipe(catchError(err => {
            this.log(`Erreur: ${err.statusText}`);
            return of(err);
          }));
      }
}