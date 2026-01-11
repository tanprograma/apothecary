import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';
import { Sale } from '../interfaces/sale';
import { SalesService } from '../services/sales.service';
import { LoggerService } from '../services/logger.service';
import { DateService } from '../services/date.service';
import { start } from 'repl';

export type SalesSummary = {
  product: string;
  unit: string;

  quantity: number;
  amount: number;
};

export interface ISaleItem {
  product: any;
  quantity: number;
  unit: string;
  unit_value: number;
  price: number;
}
export interface ISale {
  store: any;
  customer: string;
  // date: number;
  discount: number;
  products: ISaleItem[];
  createdAt: string;
}
export interface DisplayedSale extends ISaleItem {
  date: string;
  time: string;
}
type StatisticsState = {
  salesSummary: SalesSummary[];
  sales: ISale[];
  cart: ISaleItem[];
  isLoading: boolean;
  showPrescriptionForm: boolean;
  filter: { product: string; category: string };
};
const initialState: StatisticsState = {
  salesSummary: [],
  sales: [],
  cart: [],
  isLoading: false,
  showPrescriptionForm: false,
  filter: { product: '', category: '' },
};
export const SaleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state, saleService = inject(SalesService)) => {
    return {
      displayedSalesSummary: computed(() => {
        //   get sales summary
        return state
          .salesSummary()
          .filter((item) => item.quantity > 0)
          .filter((sale) => {
            if (!!state.filter.product()) {
              return sale.product.includes(state.filter.product());
            } else {
              return true;
            }
          })
          .filter((sale) => {
            if (!!state.filter.category()) {
              return sale.product.includes(state.filter.category());
            } else {
              return true;
            }
          });
      }),
      displayedSales: computed(() => {
        //   get sales summary
        return saleService
          .toDisplayedSales(state.sales())
          .filter((item) => item.quantity > 0)
          .filter((sale) => {
            if (!!state.filter.product()) {
              return sale.product.includes(state.filter.product());
            } else {
              return true;
            }
          })
          .filter((sale) => {
            if (!!state.filter.category()) {
              return sale.product.includes(state.filter.category());
            } else {
              return true;
            }
          });
      }),
    };
  }),
  withMethods(
    (
      store,
      salesService = inject(SalesService),
      logger = inject(LoggerService),
      dateService = inject(DateService)
    ) => ({
      updateFilter(filter: Partial<{ product: string; category: string }>) {
        patchState(store, (state) => ({
          ...state,
          filter: { ...state.filter, ...filter },
        }));
      },
      async getSalesSummary(options: { [key: string]: any }) {
        // returns sale summary
        try {
          const res = await salesService.getSalesSummary(options);

          logger.log('sales summary fetched');
          patchState(store, (state) => ({ ...state, salesSummary: res }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      async getReport(options: { [key: string]: any }) {
        // returns sale summary
        try {
          const res = await salesService.getReport(options);
          console.log(res);
          logger.log('sales summary fetched');
          patchState(store, (state) => ({ ...state, salesSummary: res }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      async getStoreReport(options: { [key: string]: any }) {
        // returns sale summary
        try {
          const res = await salesService.getStoreReport(options);

          patchState(store, (state) => ({
            ...state,
            sales: res,
          }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      async getStoreSales(storeID: string, options: { [key: string]: any }) {
        // returns store sales
        try {
          const res = await salesService.getStoreSales(storeID, options);

          logger.log('sales fetched');

          patchState(store, (state) => ({
            ...state,
            sales: res,
          }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      setFilter(item: { action: string; payload: any }) {
        switch (item.action) {
          case 'product':
            patchState(store, (state) => ({
              ...state,
              filter: { ...state.filter, product: item.payload },
            }));
            break;

          default:
            break;
        }
      },

      async postSale(sale: Partial<ISale>) {
        const { status, result } = await salesService.postSale(sale);
        if (!!result) {
          // adds to sales
          patchState(store, (state) => {
            // adds
            return {
              ...state,
              sales: [{ ...result, products: state.cart }, ...state.sales],
            };
            // products: state.cart,
          });
          // restore the cart
          patchState(store, (state) => ({ ...state, cart: [] }));
        }

        return status;
      },
      addToSales(new_state: ISale) {
        // adds to sales
        patchState(store, (state) => {
          // adds
          return {
            ...state,
            sales: [new_state, ...state.sales],
          };
        });
        // restore the cart
        patchState(store, (state) => ({ ...state, cart: [] }));
      },
      addToCart(item: ISaleItem) {
        patchState(store, (state) => ({
          ...state,
          cart: [...state.cart, item],
        }));
      },
      removeFromCart(item: ISaleItem) {
        patchState(store, (state) => ({
          ...state,
          cart: state.cart.filter((i) => i != item),
        }));
      },
      toggleSaleForm() {
        // shows or hides the sale-form
        patchState(store, (state) => ({
          ...state,
          showPrescriptionForm: !state.showPrescriptionForm,
        }));
      },
    })
  )
);
