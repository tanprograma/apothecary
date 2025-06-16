import { Component, inject } from '@angular/core';
import { RequestAllertStore } from '../../app-stores/request-allert.store';

import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'allert-success',
  imports: [],
  templateUrl: './allert-success.component.html',
  styleUrl: './allert-success.component.scss',
})
export class AllertSuccessComponent {
  // reqState = inject(RequestAllertStore);
  reqState = inject(Notification);

  reset() {
    this.reqState.reset();
  }
}
