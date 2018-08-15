import { Component, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

import { ImageUploadService } from './image-upload.service';
import { HttpErrorResponse } from '@angular/common/http';

class FileSnippet {

  static readonly IMAGE_SIZE = { width: 950, height: 720 }

  pending: boolean = false
  status: string = 'INIT'

  constructor(public src: string, public file: File) {

  }
}

@Component({
  selector: 'bwm-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {

  @Output() imageUploaded = new EventEmitter()
  @Output() imageError = new EventEmitter()
  @Output() imageLoadedToContainer = new EventEmitter()
  @Output() croppingCancelled = new EventEmitter()

  selectedFile: FileSnippet
  imageChangedEvent: any

  constructor(private imageService: ImageUploadService,
              private toastr: ToastsManager,
              private vcr: ViewContainerRef) {
                this.toastr.setRootViewContainerRef(vcr)
              }

  private onSuccess(imageUrl: string) {
    this.selectedFile.pending = false
    this.selectedFile.status = 'OK'
    this.imageChangedEvent = null
    this.imageUploaded.emit(imageUrl)
  }

  private onFailure() {
    this.selectedFile.pending = false
    this.selectedFile.status = 'FAIL'
    this.imageChangedEvent = null
    this.imageError.emit('')
  }

  imageCropped(file: File): FileSnippet | File {
    if (this.selectedFile) {
      return this.selectedFile.file = file
    }

    return this.selectedFile = new FileSnippet('', file)
  }

  imageLoaded() {
    this.imageLoadedToContainer.emit()
  }

  cancelCropping() {
    this.imageChangedEvent = null
    this.croppingCancelled.emit()
  }

  processFile(event: any) {
    this.selectedFile = undefined
    const URL = window.URL

    let file, img

    if ((file = event.target.files[0]) && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      img = new Image()

      const self = this

      img.onload = function() {
        if (this.width > FileSnippet.IMAGE_SIZE.width && this.height > FileSnippet.IMAGE_SIZE.height) {
          self.imageChangedEvent = event
        } else {
          self.toastr.error(`Minimum width is ${FileSnippet.IMAGE_SIZE.width} and minimum height is ${FileSnippet.IMAGE_SIZE.height}`, 'Error:')
        }
      }

      img.src = URL.createObjectURL(file)

    } else {
      this.toastr.error('Unsupported file type. Only JPEG and PNG allowed!', 'Error:')
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      const reader = new FileReader()

      reader.addEventListener('load', (event: any) => {
        this.selectedFile.src = event.target.result
        this.selectedFile.pending = true
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl: string) => {
            this.onSuccess(imageUrl)
          },
          (err: HttpErrorResponse) => {
            this.toastr.error(err.error.errors[0].detail, 'Error:')
            this.onFailure()
          }
        )
      })
      reader.readAsDataURL(this.selectedFile.file)
    }
  }
}
