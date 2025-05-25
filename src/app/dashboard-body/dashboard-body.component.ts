import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-body.component.html',
  styleUrl: './dashboard-body.component.css'
})
export class DashboardBodyComponent {
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  result: any = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      this.uploadImage(); // Auto-upload image after selection
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.loading = true;
    this.result = null;
    this.error = null;

    this.http.post<any>('http://127.0.0.1:8000/analyze-image/', formData).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Upload failed.';
        this.loading = false;
      }
    });
  }
}
