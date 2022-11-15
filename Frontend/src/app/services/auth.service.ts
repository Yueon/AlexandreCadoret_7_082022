import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, } from 'rxjs/operators';
import { BehaviorSubject, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { HttpResponse } from '../interfaces/http-response';
import { MessagesService } from './messages.service';
import { UserModel } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user!: UserModel;
  private token = "";
  public userId = "";
  private userUrl = `${environment.backendServer}/api/auth`;
  isAuth$ = new BehaviorSubject<boolean>(false);

  loggedIn:boolean = false;

  IsAuthenticated(){
    return !!localStorage.getItem('token')
  }

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
    private router: Router,
  ) { }

  private log(message: string): void {
    this.messagesService.add(`Authentification: ${message}`);
  }

  loginUser(email: string, password: string) {
    return this.httpClient
        .post<{
            userId: string;
            token: string;
            expiresIn: string;
        }>(this.userUrl + "/login", {
            email: email,
            password: password,
        })
        .pipe(
            tap(({ userId, token }) => {
                this.userId = userId;
                this.token = token;
            })
        );
  }

  public createUser(pseudo: string, email: string, password: string): Observable<HttpResponse>{
    return this.httpClient.post(`${this.userUrl}/signup`, {pseudo, email, password}, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      return of(err);
    }));
  }

getUserId() {
  return localStorage.getItem('userId');
}

getToken() {
  return localStorage.getItem('token');
}

logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  this.token = '';
  this.userId = '';
  this.router.navigate(['login']);
}
}