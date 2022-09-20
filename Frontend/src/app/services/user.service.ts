import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { User } from "src/app/interfaces/user";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class UserService {
    user$ = new BehaviorSubject<any>([]);
    private backendServer = environment.backendServer;
    constructor(private http: HttpClient) {}

    getUserById(id: string) {
        this.http
            .get<User>(this.backendServer + "/api/auth/" + id)
            .pipe(
                tap((user) => {
                    this.user$.next(user);
                })
            )
            .subscribe();
    }

    updateUser(id: string, image: any, pseudo: string) {
        const formData = new FormData();
        const user = { pseudo: pseudo };
        formData.append("user", JSON.stringify(user));
        formData.append("image", image);
        return this.http.put<{ message: string }>(this.backendServer + "/api/auth/" + id, formData);
    }

    getAllUser() {
        return this.http.get<[User]>(this.backendServer + "/api/auth");
    }

    deleteUser(id: string) {
        return this.http.delete<{ message: string }>(this.backendServer + "/api/auth/" + id);
    }
}