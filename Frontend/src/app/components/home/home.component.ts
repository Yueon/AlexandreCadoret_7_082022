import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';
import { ImageService } from 'src/app/services/image.service';

import { HttpResponse } from '../../interfaces/http-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public AuthService: AuthService,
    private messagesService: MessagesService,
    public ImageService: ImageService
  ) { }

  ngOnInit(): void {
  }

}
