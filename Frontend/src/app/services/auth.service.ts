import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpResponse } from '../interfaces/http-response'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userUrl = `http://localhost:3000/api/auth`

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }

  public loginUser(email: string, password: string): void {
    this.httpClient.post(`${this.userUrl}/login`, {email, password}, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      return of(err);
    }))
    .subscribe((response: HttpResponse): void => {
      if (response.status === 200) {
        this.router.navigate(['/profil']);
      }
    })
  }

  public createUser(pseudo: string, email: string, password: string): Observable<HttpResponse>{
    return this.httpClient.post(`${this.userUrl}/signup`, {pseudo, email, password}, { withCredentials: true, observe: 'response' })
    .pipe(catchError(err => {
      return of(err);
    }));
  }
}
