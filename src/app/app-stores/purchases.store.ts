import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';

import { LoggerService } from '../services/logger.service';
import { PurchasesService } from '../services/purchases.service';
import { DateService } from '../services/date.service';

export type PurchaseSummary = {
  product: string;
  unit: string;
  unit_value: number;
  requested: number;
  received: number;
  amount: number;
};

export interface IPurchaseItem {
  product: string;
  requested: number;
  received: number;
  unit: string;
  unit_value: number;
  price: number;
}
export interface IPurchase {
  _id: string;
  destination: any;
  source: any;

  products: IPurchaseItem[];
  createdAt: string;
  completed: boolean;
}
export interface DisplayedPurchase extends IPurchaseItem {
  date: string;
  time: string;
}
type PurchasesState = {
  summary: PurchaseSummary[];
  purchases: IPurchase[];
  cart: IPurchaseItem[];
  receiveCart: IPurchaseItem[];
  isLoading: boolean;

  filter: { product: string; category: string };
};
const initialState: PurchasesState = {
  summary: [],
  purchases: [],
  cart: [],
  receiveCart: [],
  isLoading: false,

  filter: { product: '', category: '' },
};
export const PurchasesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state, dateService = inject(DateService)) => {
    return {
      displayedSummary: computed(() => {
        //   get sales summary
        return state
          .summary()
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
          })
          .filter((item) => item.requested > 0);
      }),
      displayedPurchases: computed(() => {
        //   get sales summary
        return state.purchases().map((req) => {
          const { date, time } = dateService.parseDate(req.createdAt);
          return { ...req, createdAt: `${date} ${time}` };
        });
      }),
    };
  }),
  withMethods(
    (
      store,
      purchaseService = inject(PurchasesService),
      dateService = inject(DateService),
      logger = inject(LoggerService)
    ) => ({
      async getPurchasesSummary(options: { [key: string]: any }) {
        try {
          const res = await purchaseService.getPurchasesSummary(options);

          logger.log('purchase summary fetched');

          patchState(store, (state) => ({ ...state, summary: res }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      async getStorePurchases(
        storeID: string,
        options: { [key: string]: any }
      ) {
        try {
          const res = await purchaseService.getStorePurchases(storeID, options);

          logger.log('purchases fetched');

          patchState(store, (state) => ({
            ...state,
            purchases: res,
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
      async postPurchase(sale: Partial<IPurchase>) {
        const { status, result } = await purchaseService.postPurchase(sale);
        // console.log({ result, status });
        if (!!result) {
          // adds to sales
          logger.log('request posted successfully');

          const { date, time } = dateService.parseDate(result.createdAt);
          // console.log({ date, time });
          patchState(store, (state) => {
            // adds
            return {
              ...state,
              purchases: [
                {
                  ...result,
                  products: state.cart,
                },
                ...state.purchases,
              ],
            };
          });
          // restore the cart
          patchState(store, (state) => ({ ...state, cart: [] }));
        }

        return status;
      },
      async receivePurchase(sale: Partial<IPurchase>) {
        const { status } = await purchaseService.receivePurchase(sale);
        console.log({ status });
        if (!!status) {
          // adds to sales
          logger.log('request issued successfully');
          // const { date, time } = dateService.parseDate(result.createdAt);
          patchState(store, (state) => {
            // mark as completed
            return {
              ...state,
              purchases: state.purchases.map((req) => {
                return req._id == sale._id
                  ? { ...req, completed: true, products: state.receiveCart }
                  : req;
              }),
            };
          });
          // restore the cart
          patchState(store, (state) => ({ ...state, receiveCart: [] }));
        }

        return status;
      },

      updateReceiveCartItem(payload: Partial<IPurchaseItem>) {
        // can be used to update fields of items in cart
        patchState(store, (state) => ({
          ...state,
          receiveCart: state.receiveCart.map((item) => {
            return item.product == payload.product
              ? { ...item, ...payload }
              : item;
          }),
        }));
      },
      addToCart(item: IPurchaseItem) {
        patchState(store, (state) => ({
          ...state,
          cart: [...state.cart, item],
        }));
      },
      removeFromCart(item: IPurchaseItem) {
        patchState(store, (state) => ({
          ...state,
          cart: state.cart.filter((i) => i != item),
        }));
      },
      clearReceiveCart() {
        patchState(store, (state) => ({ ...state, receiveCart: [] }));
      },
      setReceiveCart(items: IPurchaseItem[]) {
        patchState(store, (state) => ({ ...state, receiveCart: items }));
      },
    })
  )
);
