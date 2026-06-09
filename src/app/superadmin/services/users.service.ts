import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { User } from '@core/models/interface';

@Injectable({ providedIn: 'root' })
export class UsersManagementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll(filters?: { role?: string; isActive?: boolean; search?: string }): Observable<User[]> {
    let params = new HttpParams();
    if (filters?.role) params = params.set('role', filters.role);
    if (filters?.isActive !== undefined) params = params.set('isActive', String(filters.isActive));
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
  }

  deactivate(id: string): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }

  assignRoles(id: string, roles: string[]): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/roles`, { roles });
  }
}
