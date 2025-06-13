import { Component, inject } from '@angular/core';
import { InventoriesStore } from '../../app-stores/inventory.store';

@Component({
  selector: 'inventory-details',
  imports: [],
  templateUrl: './inventory-details.component.html',
  styleUrl: './inventory-details.component.scss',
})
export class InventoryDetailsComponent {
  inventoryStore = inject(InventoriesStore);
}
