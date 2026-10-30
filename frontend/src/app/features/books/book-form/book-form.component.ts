import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BookPayload } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
})
export class BookFormComponent implements OnInit {
  readonly currentYear = new Date().getFullYear();

  form: FormGroup;
  bookId: number | null = null;
  saving = false;
  serverErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      publication_year: [
        null,
        [Validators.required, Validators.min(1000), Validators.max(this.currentYear)],
      ],
      isbn: ['', [Validators.pattern(/^(\d{10}|\d{13})$/)]],
    });
  }

  get isEdit(): boolean {
    return this.bookId !== null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = Number(id);
      this.bookService.getById(this.bookId).subscribe({
        next: (book) => this.form.patchValue(book),
        error: () => this.router.navigate(['/books']),
      });
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!control && control.touched && control.hasError(error);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: BookPayload = {
      title: raw.title.trim(),
      author: raw.author.trim(),
      publication_year: Number(raw.publication_year),
      isbn: raw.isbn?.trim() || null,
    };

    this.saving = true;
    this.serverErrors = [];

    const request$ = this.isEdit
      ? this.bookService.update(this.bookId!, payload)
      : this.bookService.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/books']),
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.serverErrors = this.extractErrors(err);
      },
    });
  }

  // Transforme {"isbn": ["..."]} renvoyé par DRF en liste de messages
  private extractErrors(err: HttpErrorResponse): string[] {
    if (err.status === 400 && err.error && typeof err.error === 'object') {
      return Object.entries(err.error).flatMap(([field, msgs]) =>
        (Array.isArray(msgs) ? msgs : [msgs]).map((m) => `${field} : ${m}`)
      );
    }
    return ['Une erreur est survenue, veuillez réessayer.'];
  }
}