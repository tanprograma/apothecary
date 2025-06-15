import { Component, Input } from '@angular/core';

@Component({
  selector: 'informatique',
  imports: [],
  templateUrl: './informatique.component.html',
  styleUrl: './informatique.component.scss',
})
export class InformatiqueComponent {
  @Input() info!: { title: string; content: number | string };
}
