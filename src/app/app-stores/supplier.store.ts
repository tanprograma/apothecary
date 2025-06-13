import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';

import { LoggerService } from '../services/logger.service';

import { SupplierService } from '../services/supplier.service';

export interface ISupplier {
  name: string;
  _id: string;
}
type SupplierState = {
  stores: ISupplier[];
  selectedStore: ISupplier | null;
  isLoading: boolean;
};
const initialState: SupplierState = {
  stores: [],
  selectedStore: {
    name: 'mainclinic',
    _id: '6815c9a685857d37ac651bcc',
  },
  isLoading: false,
};
export const SupplierStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({})),

  withMethods(
    (
      store,
      storeService = inject(SupplierService),
      logger = inject(LoggerService)
    ) => ({
      setSelectedStore(item?: ISupplier) {
        patchState(store, (state) => ({ ...state, selectedStore: item }));
        logger.log(`set supplier to ${item}`);
      },
      async getStores() {
        try {
          const res = await storeService.getStores();

          logger.log('suppliers fetched');
          patchState(store, (state) => ({ ...state, stores: res }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      findStore(identifier: string) {
        return store.stores().find((item) => {
          return item.name == identifier || item._id == identifier;
        }) as ISupplier;
      },
      async postStore(payload: Partial<ISupplier>) {
        const { status, result } = await storeService.postStore(payload);
        if (!!result) {
          patchState(store, (state) => ({
            ...state,
            stores: [result, ...state.stores],
          }));
        }
      },
    })
  )
);
