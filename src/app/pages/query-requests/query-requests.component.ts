import { Component, computed, inject, signal } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OutletsStore } from '../../app-stores/outlet.store';
import { ProductsStore } from '../../app-stores/products.store';
import { ISale } from '../../app-stores/sale.store';
import { IRequest } from '../../app-stores/transfers.store';

@Component({
  selector: 'query-requests',
  imports: [ReactiveFormsModule],
  templateUrl: './query-requests.component.html',
  styleUrl: './query-requests.component.scss',
})
export class QueryRequestsComponent {
  private fb = inject(FormBuilder);
  private requestService = inject(RequestsService);
  outletsStore = inject(OutletsStore);
  productsStore = inject(ProductsStore);
  requests = signal<
    Pick<IRequest, 'source' | 'products' | 'createdAt' | 'destination'>[]
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
    return this.requests()

      .reduce((acc, sale) => {
        acc.push(
          ...sale.products.map((item) => {
            return {
              ...item,
              createdAt: new Date(sale.createdAt).toLocaleDateString(),
              source: sale.source.name,
              destination: sale.destination.name,
            };
          })
        );
        return acc;
      }, [] as any[])
      .filter((inv) => {
        const matchesSource =
          sourceName != '' ? inv.source.includes(sourceName) : true;
        const matchesDestination =
          destinationName != ''
            ? inv.destination.includes(destinationName)
            : true;

        const matchesProduct =
          productName != '' ? inv.product.name.includes(productName) : true;
        return matchesSource && matchesDestination && matchesProduct;
      });
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
      this.requestService.getRequestsQuery(
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
