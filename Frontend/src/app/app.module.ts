import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { AuthGuardService } from './services/auth-guard.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SigninComponent } from './components/auth/signin/signin.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ProfilComponent } from './components/profil/profil.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { PostComponent } from './components/post/post.component';
import { PostWallComponent } from './components/post-wall/post-wall.component';
import { HomeLaunchComponent } from './components/home-launch/home-launch.component';
import { AuthInterceptor } from 'src/interceptors/auth-interceptors';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SigninComponent,
    LoginComponent,
    MessagesComponent,
    ProfilComponent,
    HomeComponent,
    PostComponent,
    PostWallComponent,
    HomeLaunchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ImageCropperModule,
    NoopAnimationsModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
  ],
  providers: [AuthService, AuthGuardService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
