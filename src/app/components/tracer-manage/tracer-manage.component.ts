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
import { ActivatedRoute } from '@angular/router';
import { TracerService } from '../../services/tracer.service';
@Component({
  selector: 'tracer-manage',
  imports: [
    JsonPipe,
    FontAwesomeModule,
    TracerFormComponent,
    SearchBoxComponent,
  ],
  templateUrl: './tracer-manage.component.html',
  styleUrl: './tracer-manage.component.scss',
})
export class TracerManageComponent {
  plusIcon = faAdd;
  outletStore = inject(OutletsStore);

  notification = inject(Notification);
  route = inject(ActivatedRoute);
  tracerService = inject(TracerService);
  constructor() {}
  tracerReport: TracerReport | null = null;
  ngOnInit() {
    this.getTracer();
  }
  getTracerID() {
    return this.route.snapshot.paramMap.get('tracerID');
  }
  getTracer() {
    const tracerID = this.getTracerID();
    if (!tracerID) {
      return;
    }
    this.notification.updateNotification({ loading: true });
    this.tracerService.getTracer(tracerID).then((report) => {
      if (!!report) {
        this.tracerReport = report;
      }
      this.notification.reset();
    });
  }
  totalReceived() {
    if (!this.tracerReport) {
      return 0;
    } else {
      return (
        this.tracerReport.quantity +
        this.tracerReport.received +
        this.tracerReport.purchased
      );
    }
  }
  totalIssued() {
    if (!this.tracerReport) {
      return 0;
    } else {
      return this.tracerReport.issued + this.tracerReport.dispensed;
    }
  }
  getComputed() {
    return this.totalReceived() - this.totalIssued();
  }
  getDifference() {
    if (!this.tracerReport) {
      return 0;
    } else {
      return this.getComputed() - this.tracerReport.available;
    }
  }
  isPositive() {
    return this.getDifference() >= 0;
  }
  absDiff() {
    return Math.abs(this.getDifference());
  }
  // filterTracer(filter: string) {
  //   this.inventoriesStore.setTracerFilter(filter);
  // }
}
