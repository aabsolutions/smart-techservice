import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface Supplier {
  _id?: string;
  ruc: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private readonly apiUrl = `${environment.apiUrl}/suppliers`;
  private http = inject(HttpClient);

  findAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  create(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  update(id: string, supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  remove(id: string): Observable<Supplier> {
    return this.http.delete<Supplier>(`${this.apiUrl}/${id}`);
  }
}
