import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class RolesManagementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/roles`;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  getAllPermissions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/permissions`);
  }
}
