import { Component, computed, inject, signal } from '@angular/core';
import { PurchasesService } from '../../services/purchases.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OutletsStore } from '../../app-stores/outlet.store';
import { ProductsStore } from '../../app-stores/products.store';
import { IRequest } from '../../app-stores/transfers.store';
import { IPurchase } from '../../app-stores/purchases.store';

@Component({
  selector: 'query-purchases',
  imports: [ReactiveFormsModule],
  templateUrl: './query-purchases.component.html',
  styleUrl: './query-purchases.component.scss',
})
export class QueryPurchasesComponent {
  private fb = inject(FormBuilder);
  private purchaseService = inject(PurchasesService);
  outletsStore = inject(OutletsStore);
  productsStore = inject(ProductsStore);
  requests = signal<
    Pick<
      IPurchase,
      'source' | 'products' | 'createdAt' | 'destination' | 'completed'
    >[]
  >([]);

  filters = signal<{ source: string; destination: string; product: string }>({
    source: '',
    destination: '',
    product: '',
  });
  loading = signal(false);

  ngOnInit() {
    this.loadResources();
  }
  form = this.fb.group({ start: [''], end: [''] });
  filterForm = this.fb.group({
    source: [''],
    destination: [''],
    product: [''],
  });
  filteredRequests = computed(() => {
    console.log('computing filtered requests');
    const sourceName = this.filters().source;
    const destinationName = this.filters().destination;
    const productName = this.filters().product;
    const filtered = this.requests().filter((inv) => {
      const matchesSource =
        sourceName != '' ? inv.source.includes(sourceName) : true;
      const matchesDestination =
        destinationName != ''
          ? inv.destination.includes(destinationName)
          : true;

      const matchesProduct =
        inv.products.some((p: any) => p.product.name.includes(productName)) ||
        true;

      return matchesSource && matchesDestination && matchesProduct;
    });

    const mappedFilterd = filtered.reduce((acc, sale) => {
      acc.push(
        ...sale.products.map((item) => {
          return {
            ...item,
            createdAt: new Date(sale.createdAt).toLocaleDateString(),
            source: sale.source.name,
            destination: sale.destination.name,
            completed: sale.completed,
          };
        })
      );
      return acc;
    }, [] as any[]);

    return {
      items: mappedFilterd,
      count: mappedFilterd.length,
      transactions: filtered.length,
    };
  });

  filterRequests() {
    const sourceName = this.filterForm.get('store')?.value ?? '';
    const destinationName = this.filterForm.get('store')?.value ?? '';
    const productName = this.filterForm.get('product')?.value ?? '';
    this.filters.set({
      source: sourceName,
      destination: destinationName,
      product: productName,
    });
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
      this.purchaseService.getPurchasesQuery(
        new Date(start).toISOString(),
        new Date(end).toISOString()
      ),
      this.outletsStore.getStores(),
      this.productsStore.getProducts(),
    ]).then(([data]) => {
      console.log({ data });
      this.requests.set(data);
      console.log('refreshed data');
      this.loading.set(false);
    });
  }

  clearFilters() {
    this.form.patchValue({ start: '', end: '' });
    this.filterForm.patchValue({ source: '', destination: '', product: '' });
  }
}
