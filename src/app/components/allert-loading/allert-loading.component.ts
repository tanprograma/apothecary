import { Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'allert-loading',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './allert-loading.component.html',
  styleUrl: './allert-loading.component.scss',
})
export class AllertLoadingComponent {
  // reqState = inject(RequestAllertStore);
  reqState = inject(Notification);
  loadingIcon = faSpinner;
}
