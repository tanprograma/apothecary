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

export type SalesSummary = {
  product: string;
  unit: string;
  unit_value: number;
  quantity: number;
  price: number;
};
type StatisticsState = {
  sales: SalesSummary[];
  isLoading: boolean;
  filter: { product: string; category: string };
};
const initialState: StatisticsState = {
  sales: [],
  isLoading: false,
  filter: { product: '', category: '' },
};
export const StatisticsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => {
    return {
      displayedSales: computed(() => {
        return state
          .sales()
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
      //   amount: computed(() => {
      //     return state.sales().reduce((cum: number, curr: any) => {
      //       curr.products.forEach((p: any) => {
      //         cum += p.price * p.quantity;
      //       });
      //       return cum;
      //     }, 0);
      //   }),
    };
  }),
  withMethods(
    (
      store,
      salesService = inject(SalesService),
      logger = inject(LoggerService)
    ) => ({
      async getSalesSummary(options: { [key: string]: any }) {
        try {
          const res = await salesService.getSalesSummary(options);

          logger.log('sales summary fetched');
          patchState(store, (state) => ({ ...state, sales: res }));
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
      // async getShopSales(limit?: number) {
      //   const sales = await shopService.getShopSales(limit);
      //   patchState(store, (state) => ({ ...state, sales: sales }));
      // },
      // async getShopSalesSummary(limit?: number) {
      //   const sales = await shopService.getShopSalesSummary(limit);
      //   patchState(store, (state) => ({ ...state, sales: sales }));
      // },
      // async getAllSalesSummary(limit?: number) {
      //   const sales = await shopService.getAllSalesSummary(limit);
      //   patchState(store, (state) => ({ ...state, sales: sales }));
      // },
      // async postSales(sale: Partial<Sale>) {
      //   const res = await shopService.postSale(sale);
      //   if (res.status) {
      //     patchState(store, (state) => ({
      //       ...state,
      //       sales: [...state.sales, res.payload as Sale],
      //     }));
      //   }
      //   return res;
      // },
    })
  )
);
