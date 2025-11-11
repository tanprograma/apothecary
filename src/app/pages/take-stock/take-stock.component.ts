import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { OutletsStore } from '../../app-stores/outlet.store';
import { TracerFormComponent } from '../../components/tracer-form/tracer-form.component';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'take-stock',
  imports: [FontAwesomeModule, TracerFormComponent],
  templateUrl: './take-stock.component.html',
  styleUrl: './take-stock.component.scss',
})
export class TakeStockComponent {
  plusIcon = faAdd;
  outletStore = inject(OutletsStore);
  inventoriesStore = inject(InventoriesStore);
  notification = inject(Notification);
}
