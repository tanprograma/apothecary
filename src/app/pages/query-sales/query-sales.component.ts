import { Component, computed, inject, signal } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { ISale } from '../../app-stores/sale.store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OutletsStore } from '../../app-stores/outlet.store';
import { ProductsStore } from '../../app-stores/products.store';

@Component({
  selector: 'query-sales',
  imports: [ReactiveFormsModule],
  templateUrl: './query-sales.component.html',
  styleUrl: './query-sales.component.scss',
})
export class QuerySalesComponent {
  private fb = inject(FormBuilder);
  private salesService = inject(SalesService);
  outletsStore = inject(OutletsStore);
  productsStore = inject(ProductsStore);
  sales = signal<Pick<ISale, 'store' | 'products' | 'createdAt'>[]>([]);

  filters = signal<{ store: string; product: string }>({
    store: '',
    product: '',
  });
  loading = signal(false);
  ngOnInit() {
    this.loadResources();
  }
  form = this.fb.group({ start: [''], end: [''] });
  filterForm = this.fb.group({ store: [''], product: [''] });
  filteredSales = computed(() => {
    console.log('computing filtered sales');
    const storeName = this.filters().store;
    const productName = this.filters().product;
    return this.sales()

      .reduce((acc, sale) => {
        acc.push(
          ...sale.products.map((item) => {
            return {
              ...item,
              createdAt: new Date(sale.createdAt).toLocaleDateString(),
              store: sale.store.name,
            };
          })
        );
        return acc;
      }, [] as any[])
      .filter((inv) => {
        const matchesStore =
          storeName != '' ? inv.store.name.includes(storeName) : true;

        const matchesProduct =
          productName != '' ? inv.product.name.includes(productName) : true;
        return matchesStore && matchesProduct;
      });
  });

  filterSales() {
    const storeName = this.filterForm.get('store')?.value ?? '';
    const productName = this.filterForm.get('product')?.value ?? '';
    this.filters.set({ store: storeName, product: productName });
    console.log(this.filters());
  }
  loadResources() {
    this.loading.set(true);
    Promise.all([
      this.outletsStore.getStores(),
      this.productsStore.getProducts(),
    ]).then(([data]) => {
      this.loading.set(false);
    });
  }
  refresh() {
    const start = this.form.get('start')?.value ?? '';
    const end = this.form.get('end')?.value ?? '';
    this.loading.set(true);
    Promise.all([
      this.salesService.getSalesQuery(
        new Date(start).toISOString(),
        new Date(end).toISOString()
      ),
      this.outletsStore.getStores(),
      this.productsStore.getProducts(),
    ]).then(([data]) => {
      console.log({ data });
      this.sales.set(data);
      console.log('refreshed data');
      this.loading.set(false);
    });
  }

  clearFilters() {
    this.form.patchValue({ start: '', end: '' });
    this.filterForm.patchValue({ store: '', product: '' });
  }
}
