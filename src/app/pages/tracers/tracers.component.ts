import { Component, inject } from '@angular/core';
import { OutletsStore } from '../../app-stores/outlet.store';

import { JsonPipe } from '@angular/common';
import { TracerReport } from '../../interfaces/tracer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { TracerFormComponent } from '../../components/tracer-form/tracer-form.component';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { Notification } from '../../app-stores/notification.store';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';

@Component({
  selector: 'tracers',
  imports: [
    JsonPipe,
    FontAwesomeModule,
    TracerFormComponent,
    SearchBoxComponent,
  ],
  templateUrl: './tracers.component.html',
  styleUrl: './tracers.component.scss',
})
export class TracersComponent {
  plusIcon = faAdd;
  outletStore = inject(OutletsStore);
  inventoriesStore = inject(InventoriesStore);
  notification = inject(Notification);

  constructor() {}
  ngOnInit() {
    this.getTracers();
  }
  getTracers() {
    this.notification.updateNotification({ loading: true });
    this.inventoriesStore.getTracers().then((_) => this.notification.reset());
  }
  totalReceived(item: TracerReport) {
    return item.quantity + item.received + item.purchased;
  }
  totalIssued(item: TracerReport) {
    return item.issued + item.dispensed;
  }
  getComputed(item: TracerReport) {
    return this.totalReceived(item) - this.totalIssued(item);
  }
  getDifference(item: TracerReport) {
    return this.getComputed(item) - item.available;
  }
  isPositive(item: TracerReport) {
    return this.getDifference(item) >= 0;
  }
  absDiff(item: TracerReport) {
    return Math.abs(this.getDifference(item));
  }
  filterTracer(filter: string) {
    this.inventoriesStore.setTracerFilter(filter);
  }
}
