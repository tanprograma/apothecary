import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';

import { LoggerService } from '../services/logger.service';
import { DateService } from '../services/date.service';
import { Product } from '../interfaces/product';
import { IStore } from './outlet.store';
import { ExpiryService } from '../services/expiry.service';

export interface Expiry<product, store> {
  _id: string;
  store: store;
  quantity: number;
  unit: string;
  unit_value: number;
  price: number;
  product: product;
  expiry: string;
  destroyed: boolean;
}

type ExpiryState = {
  expired: Expiry<string, string>[];
};
const initialState: ExpiryState = {
  expired: [],
};
export const ExpiryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state, dateService = inject(DateService)) => {
    return {
      displayedExpired: computed(() => {
        //   get sales summary
        return state.expired().map((item) => {
          const { date } = dateService.parseDate(item.expiry);
          return {
            ...item,
            expiry: date,
          };
        });
      }),
    };
  }),
  withMethods(
    (
      store,
      expiryService = inject(ExpiryService),
      logger = inject(LoggerService)
    ) => ({
      async getExpiry(storeID?: string) {
        // returns store sales
        try {
          const res = await expiryService.getExpiry(storeID);

          logger.log('expiry fetched');

          patchState(store, (state) => ({
            ...state,
            expired: res,
          }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      //   setFilter(item: { action: string; payload: any }) {
      //     switch (item.action) {
      //       case 'product':
      //         patchState(store, (state) => ({
      //           ...state,
      //           filter: { ...state.filter, product: item.payload },
      //         }));
      //         break;

      //       default:
      //         break;
      //     }
      //   },

      async postExpiry(
        sale: Partial<Expiry<string, string>>,
        original: Partial<Expiry<string, string>>
      ) {
        const { status, result } = await expiryService.postExpiry(sale);
        if (!!result) {
          // adds to sales
          patchState(store, (state) => {
            // adds
            return {
              ...state,
              expired: [
                {
                  ...original,
                  _id: result._id,
                  expiry: result.expiry,
                } as Expiry<string, string>,
                ...state.expired,
              ],
            };
          });
        }

        return status;
      },
    })
  )
);
