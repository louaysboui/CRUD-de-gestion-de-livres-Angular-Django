import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Book, BookPayload } from '../models/book.model';


@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly url = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

    getAll(search?: string): Observable<Book[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Book[]>(this.url, { params });
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.url}/${id}`);
  }

  create(book: BookPayload): Observable<Book> {
    return this.http.post<Book>(this.url, book);
  }

  update(id: number, book: BookPayload): Observable<Book> {
    return this.http.put<Book>(`${this.url}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}