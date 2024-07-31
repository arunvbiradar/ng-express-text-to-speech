import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule], // Add HttpClientModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Fixed typo from styleUrl to styleUrls
})
export class AppComponent {
  selectedFile: File | null = null;
  audioSrc: string = '';
  statusMessage: string = '';
  text: string = '';

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.statusMessage = 'File is uploading...';
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http
        .post<{ url: string; text: string }>(
          'http://localhost:3000/upload',
          formData
        )
        .subscribe({
          next: (response) => {
            this.statusMessage =
              'File is uploaded. Text is being converted to MP3...';
            this.audioSrc =
              'http://localhost:3000/audio/' + response.url + '.mp3';
            this.text = response.text;
            this.statusMessage = 'Your audio is ready';

            this.fileInput.nativeElement.value = '';

            this.activateAudio();
          },
          error: (err) => {
            console.error('Upload error:', err);
          },
        });
    }
  }

  activateAudio() {
    setTimeout(() => {
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.load();
      }
    }, 1000); // Delay to ensure the URL is set
  }
}
