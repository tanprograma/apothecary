import { Component, inject } from '@angular/core';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'allert-failure',
  imports: [],
  templateUrl: './allert-failure.component.html',
  styleUrl: './allert-failure.component.scss',
})
export class AllertFailureComponent {
  // reqState = inject(RequestAllertStore);
  reqState = inject(Notification);

  reset() {
    this.reqState.reset();
  }
}
