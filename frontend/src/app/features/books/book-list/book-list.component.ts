import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Subject, catchError, debounceTime, distinctUntilChanged,
  map, of, startWith, switchMap, takeUntil, tap,
} from 'rxjs';

import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  loading = false;
  error: string | null = null;

  searchControl = new FormControl('', { nonNullable: true });

  private destroy$ = new Subject<void>();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        debounceTime(300),               // attend 300 ms après la dernière frappe
        map((value) => value.trim()),
        distinctUntilChanged(),          // pas de requête si le texte n'a pas changé
        tap(() => {
          this.loading = true;
          this.error = null;
        }),
        switchMap((term) =>
          this.bookService.getAll(term).pipe(
            catchError(() => {
              this.error = 'Impossible de charger les livres. Le serveur est-il démarré ?';
              return of([] as Book[]);
            })
          )
        ),                               // annule la requête précédente si une nouvelle part
        takeUntil(this.destroy$)
      )
      .subscribe((books) => {
        this.books = books;
        this.loading = false;
      });
  }

  get isSearching(): boolean {
    return this.searchControl.value.trim().length > 0;
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  onDelete(book: Book): void {
    if (!confirm(`Supprimer « ${book.title} » ?`)) {
      return;
    }
    this.bookService.delete(book.id).subscribe({
      next: () => (this.books = this.books.filter((b) => b.id !== book.id)),
      error: () => (this.error = 'La suppression a échoué.'),
    });
  }

  trackById(_: number, book: Book): number {
    return book.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}