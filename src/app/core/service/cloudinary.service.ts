import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private http = inject(HttpClient);
  private uploadUrl = `${environment.apiUrl}/upload`;

  /**
   * Uploads one or more image files to the backend (which then sends them to Cloudinary).
   * Returns an Observable with the array of secure Cloudinary URLs.
   */
  uploadFiles(files: File[]): Observable<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<{ urls: string[] }>(this.uploadUrl, formData);
  }
}
