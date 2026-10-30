import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { BookFormComponent } from './book-form/book-form.component';
import { BookListComponent } from './book-list/book-list.component';
import { BooksRoutingModule } from './books-routing.module';

@NgModule({
  declarations: [BookListComponent, BookFormComponent],
  imports: [CommonModule, ReactiveFormsModule, BooksRoutingModule],
})
export class BooksModule {}