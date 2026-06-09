import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Client {
  _id?: string;
  cedula: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clients`;

  getAll(search?: string): Observable<Client[]> {
    const params: any = {};
    if (search) params.search = search;
    return this.http.get<Client[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  update(id: string, client: Partial<Client>): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, client);
  }

  deactivate(id: string): Observable<Client> {
    return this.http.delete<Client>(`${this.apiUrl}/${id}`);
  }
}
