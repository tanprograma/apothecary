import { Component, Input } from '@angular/core';
import { Log } from '../../app-stores/logs.store';

@Component({
  selector: 'log',
  standalone: true,
  imports: [],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss',
})
export class LogComponent {
  @Input() log!: Log;
}
