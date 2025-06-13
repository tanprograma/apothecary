import { Component, inject } from '@angular/core';
import { RequestAllertStore } from '../../app-stores/request-allert.store';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'allert-failure',
  imports: [],
  templateUrl: './allert-failure.component.html',
  styleUrl: './allert-failure.component.scss',
})
export class AllertFailureComponent {
  // reqState = inject(RequestAllertStore);
  reqState = inject(NotificationService);

  reset() {
    this.reqState.reset();
  }
}
