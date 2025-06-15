import { Component, Input } from '@angular/core';
import { Info } from '../../app-stores/inventory.store';
import { InformatiqueComponent } from '../informatique/informatique.component';

@Component({
  selector: 'home-info',
  imports: [InformatiqueComponent],
  templateUrl: './home-info.component.html',
  styleUrl: './home-info.component.scss',
})
export class HomeInfoComponent {
  @Input() info!: Info;
}
