import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../interfaces/inventory';
import { IInventory } from '../../app-stores/inventory.store';
import { IStore, OutletsStore } from '../../app-stores/outlet.store';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'query-inventory',
  imports: [ReactiveFormsModule],
  templateUrl: './query-inventory.component.html',
  styleUrl: './query-inventory.component.scss',
})
export class QueryInventoryComponent {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  outletsStore = inject(OutletsStore);
  inventories = signal<
    Pick<IInventory<Product, IStore>, 'store' | 'product' | 'quantity'>[]
  >([]);

  filters = signal<{ store: string; product: string }>({
    store: '',
    product: '',
  });
  loading = signal(false);
  ngOnInit() {
    this.refresh();
  }
  form = this.fb.group({ store: [''], product: [''] });
  filteredInventories = computed(() => {
    const storeName = this.filters().store;
    const productName = this.filters().product;

    return this.inventories().filter((inv) => {
      const matchesStore =
        storeName != '' ? inv.store.name.includes(storeName) : true;

      const matchesProduct =
        productName != '' ? inv.product.name.includes(productName) : true;
      return matchesStore && matchesProduct;
    });
  });
  filterInventory() {
    const storeName = this.form.get('store')?.value ?? '';
    const productName = this.form.get('product')?.value ?? '';
    this.filters.set({ store: storeName, product: productName });
  }
  refresh() {
    this.loading.set(true);
    Promise.all([
      this.inventoryService.getInventoryQuery(),
      this.outletsStore.getStores(),
    ]).then(([data]) => {
      this.inventories.set(data);
      console.log('refreshed data');
      this.loading.set(false);
    });
  }

  clearFilters() {
    this.form.patchValue({ store: '', product: '' });
  }
}
