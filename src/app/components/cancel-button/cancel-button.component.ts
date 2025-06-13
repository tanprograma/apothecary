import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cancel-button',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './cancel-button.component.html',
  styleUrl: './cancel-button.component.scss',
})
export class CancelButtonComponent {
  timesIcon = faTimes;
}
