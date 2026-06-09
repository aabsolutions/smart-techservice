import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tickets`;

  create(ticket: any): Observable<any> {
    return this.http.post(this.apiUrl, ticket);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  findOne(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  update(id: string, ticket: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, ticket);
  }

  remove(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: string, notes: string, photos?: string[]): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status, notes, photos });
  }

  removeHistory(ticketId: string, historyId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${ticketId}/history/${historyId}`);
  }
}
