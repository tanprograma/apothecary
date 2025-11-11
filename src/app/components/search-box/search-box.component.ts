import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search-box',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent {
  faSearch = faSearch;
  @Output() emitSearch = new EventEmitter<string>();
  @Input() predicate?: string;
  formBuilder = inject(FormBuilder);
  searchForm = this.formBuilder.group({
    query: this.predicate ?? '',
  });
  onSearch() {
    const value = this.searchForm.value.query ?? '';
    this.emitSearch.emit(value);
  }
}
