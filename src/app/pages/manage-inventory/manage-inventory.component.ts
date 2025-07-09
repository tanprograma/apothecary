import { Component, inject, OnDestroy } from '@angular/core';
import { IInventory, InventoriesStore } from '../../app-stores/inventory.store';
import { IStore, OutletsStore } from '../../app-stores/outlet.store';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Product } from '../../interfaces/product';
import { ManageExpiryComponent } from '../../components/manage-expiry/manage-expiry.component';
import { InventoryDetailsComponent } from '../../components/inventory-details/inventory-details.component';
import { ManageQuantityComponent } from '../../components/manage-quantity/manage-quantity.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';

@Component({
  selector: 'manage-inventory',
  imports: [
    FontAwesomeModule,
    ManageExpiryComponent,
    InventoryDetailsComponent,
    ManageQuantityComponent,
    SearchBoxComponent,
  ],
  templateUrl: './manage-inventory.component.html',
  styleUrl: './manage-inventory.component.scss',
})
export class ManageInventoryComponent implements OnDestroy {
  inventoryStore = inject(InventoriesStore);

  outletStore = inject(OutletsStore);
  editIcon = faEdit;
  cancelIcon = faTimes;
  showDetails = false;
  ngOnDestroy(): void {
    this.inventoryStore.updateFilter({ product: '' });
  }
  selectInventoryItem(item: IInventory<Product, IStore>) {
    this.showDetails = true;
    this.inventoryStore.setSelectedInvetory(item);
  }
  closeManageView() {
    this.inventoryStore.setSelectedInvetory(null);
    this.showDetails = false;
  }
  onSearch(e: string) {
    this.inventoryStore.updateFilter({ product: e });
  }
}
