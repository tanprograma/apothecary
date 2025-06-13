import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';
import { Sale } from '../interfaces/sale';
import { LoggerService } from '../services/logger.service';
import { PurchasesService } from '../services/purchases.service';
import { InventoryService } from '../services/inventory.service';
import { Product } from '../interfaces/product';
import { Store } from '../interfaces/store';
import { IStore } from './outlet.store';
import { DateService } from '../services/date.service';
import { ProductsService } from '../services/products.service';

// export interface IInventoryItem {
//   product: string;
//   quantity: number;
//   unit: string;
//   unit_value: number;;oa
//   price: number;
// }

type ProductsState = {
  products: Product[];
  newProduct: Partial<Product>;
};
const initialState: ProductsState = {
  products: [],
  newProduct: { name: '', units: [] },
};
export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => {
    return {};
  }),
  withMethods(
    (
      store,
      productsService = inject(ProductsService),

      logger = inject(LoggerService)
    ) => ({
      async getProducts() {
        const res = await productsService.getProducts();
        patchState(store, (state) => ({ ...state, products: res }));
      },
      async postProduct(payload: Partial<Product>) {
        const { status, result } = await productsService.postProduct(payload);
        if (!!result) {
          patchState(store, (state) => ({
            ...state,
            products: [result, ...state.products],
          }));
        }
      },
      setProduct(name: string) {
        patchState(store, (state) => ({
          ...state,
          newProduct: { ...state.newProduct, name },
        }));
      },
      addUnit(unit: { name: string; value: number }) {
        const { units } = store.newProduct();
        if (!!units) {
          patchState(store, (state) => ({
            ...state,
            newProduct: {
              ...state.newProduct,
              units: [...units, unit],
            },
          }));
        }
      },
      resetNewProduct() {
        patchState(store, (state) => ({
          ...state,
          newProduct: { name: '', units: [] },
        }));
      },
    })
  )
);
