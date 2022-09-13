import { Injectable } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  initialImage: any = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private messagesService: MessagesService,
  ) { }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.initialImage = event.target.files[0];
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded(): void {
      // show cropper
      document.getElementById('cropper')?.classList.remove('hidden');
  }
  loadImageFailed(): void {
      // show message
      this.messagesService.add(`Erreur du chargement de l'image`);
  }
  base64ToFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  onCroppedImageDone(): void {
    document.getElementById('cropper')?.classList.add('hidden');
  }
}

