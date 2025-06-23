import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search-box',
  imports: [FontAwesomeModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent {
  faSearch = faSearch;
  @Output() emitSearch = new EventEmitter<string>();
  onSearch(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.emitSearch.emit(value);
  }
}
