import { Component, inject } from '@angular/core';
import { LogComponent } from '../../components/log/log.component';
import { LogsStore } from '../../app-stores/logs.store';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [LogComponent],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent {
  logsStore = inject(LogsStore);
}
