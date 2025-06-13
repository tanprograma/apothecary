import { Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestAllertStore } from '../../app-stores/request-allert.store';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'allert-loading',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './allert-loading.component.html',
  styleUrl: './allert-loading.component.scss',
})
export class AllertLoadingComponent {
  // reqState = inject(RequestAllertStore);
  reqState = inject(NotificationService);
  loadingIcon = faSpinner;
}
