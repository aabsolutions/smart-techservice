import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/catalogs`;

  create(catalog: { category: string; name: string }): Observable<any> {
    return this.http.post(this.apiUrl, catalog);
  }

  findByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?category=${category}`);
  }
}
