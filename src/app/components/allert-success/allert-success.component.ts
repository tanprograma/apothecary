import { Component, inject } from '@angular/core';
import { RequestAllertStore } from '../../app-stores/request-allert.store';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'allert-success',
  imports: [],
  templateUrl: './allert-success.component.html',
  styleUrl: './allert-success.component.scss',
})
export class AllertSuccessComponent {
  // reqState = inject(RequestAllertStore);
  reqState = inject(NotificationService);

  reset() {
    this.reqState.reset();
  }
}
