import { Component, inject, OnInit } from '@angular/core';
import { RequestsStore } from '../../app-stores/transfers.store';
import { OutletsStore } from '../../app-stores/outlet.store';
import { RequestFormComponent } from '../../components/request-form/request-form.component';
import { RequestViewComponent } from '../../components/request-view/request-view.component';
import { RequestIssueComponent } from '../../components/request-issue/request-issue.component';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'request',
  imports: [RequestFormComponent, RequestViewComponent, RequestIssueComponent],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
})
export class RequestComponent implements OnInit {
  outletStore = inject(OutletsStore);
  transferStore = inject(RequestsStore);
  notificationStore = inject(Notification);
  ngOnInit(): void {
    this.getRequests();
  }
  getRequests() {
    this.notificationStore.updateNotification({
      message: 'getting requests',
      loading: true,
    });
    this.transferStore
      .getStoreRequests(this.outletStore.selectedStore()?._id as string, {})
      .then((res) => this.notificationStore.reset());
  }
}
