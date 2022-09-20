import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Post } from "src/app/interfaces/posts";
import { environment } from "src/environments/environment";

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
  ) { }


  createFormData(name: string, value: any, nameImage: string = "image", image: any = "") {
    const formData = new FormData();
    formData.append(name, value);
    formData.append(nameImage, image);
    return formData;
}

  createPost(content: string | File) {
    if (typeof content === "string") {
        const post = { content: content };
        return this.HttpClient.post<{ message: string }>(
            this.postsUrl + "/",
            this.createFormData("post", JSON.stringify(post))
        );
    } else {
        const post = { content: content };

        return this.HttpClient.post<{ message: string }>(
            this.postsUrl + "/",
            this.createFormData("post", JSON.stringify(post), "image", content)
        );
    }
}
  /*private log(message: string): void {
    this.messagesService.add(message);
  }

  public getPublications(limit: number, offset: number): Observable<HttpResponse> {
    return this.HttpClient.get(`${this.postsUrl}/${limit}/${offset}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

  public newPublication(formData: FormData): Observable<HttpResponse> {
    return this.HttpClient.post(`${this.postsUrl}`, formData, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }*/
}
