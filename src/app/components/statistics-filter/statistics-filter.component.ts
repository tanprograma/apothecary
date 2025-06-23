import { Component, EventEmitter, inject, Output } from '@angular/core';
import { OutletsStore } from '../../app-stores/outlet.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
export interface RequestQuery {
  [property: string]: string | number;
}
@Component({
  selector: 'statistics-filter',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './statistics-filter.component.html',
  styleUrl: './statistics-filter.component.scss',
})
export class StatisticsFilterComponent {
  @Output() onFilter = new EventEmitter<RequestQuery>();
  @Output() onReset = new EventEmitter<boolean>();
  outletStore = inject(OutletsStore);
  searchIcon = faSearch;
  refreshIcon = faRefresh;
  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    store: [''],
    start: [''],
    end: [''],
  });
  filter() {
    if (
      !this.form.value.end &&
      !this.form.value.start &&
      !this.form.value.store
    ) {
      console.log('empty query');
      return;
    }
    const query = this.buildQuery();

    this.onFilter.emit(query);
  }
  reset() {
    this.form.reset();
    this.onReset.emit(true);
  }
  buildQuery() {
    const query: RequestQuery = {};
    const ogQuery = {
      store: this.form.value.store ?? '',
      start: this.form.value.start ?? '',
      end: this.form.value.end ?? '',
    };

    if (!!ogQuery.store) {
      query['storeID'] = this.outletStore.findStore(ogQuery.store)._id;
    }
    if (!!ogQuery.start) {
      query['start'] = this.parseDate(ogQuery.start);
    }
    if (!!ogQuery.end) {
      query['end'] = this.parseDate(ogQuery.end);
    }
    return query;
  }
  parseDate(d: string) {
    return new Date(d).getTime();
  }
}
