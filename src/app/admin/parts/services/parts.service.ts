import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface Part {
  _id?: string;
  code: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  stock: number;
  category?: string;
  isActive?: boolean;
  supplierId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private readonly apiUrl = `${environment.apiUrl}/parts`;
  private http = inject(HttpClient);

  findAll(): Observable<Part[]> {
    return this.http.get<Part[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Part> {
    return this.http.get<Part>(`${this.apiUrl}/${id}`);
  }

  create(part: Part): Observable<Part> {
    return this.http.post<Part>(this.apiUrl, part);
  }

  update(id: string, part: Partial<Part>): Observable<Part> {
    return this.http.patch<Part>(`${this.apiUrl}/${id}`, part);
  }

  remove(id: string): Observable<Part> {
    return this.http.delete<Part>(`${this.apiUrl}/${id}`);
  }
}
