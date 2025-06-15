import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';

import { LoggerService } from '../services/logger.service';
import { OutletService } from '../services/outlet.service';
import { adminLinks } from '../app.utils/admin-links.util';

const shopLinks: {
  name: string;
  url: string;
}[] = [
  {
    name: 'dispense',
    url: `sell`,
  },

  {
    name: 'request',
    url: `request`,
  },

  {
    name: 'purchase',
    url: `purchase`,
  },
  {
    name: 'expired',
    url: `expiry`,
  },

  {
    name: 'manage inventory',
    url: `manage-inventory`,
  },
];
const manageLinks: {
  name: string;
  url: string;
}[] = [
  {
    name: 'home',
    url: `/home`,
  },

  {
    name: 'admin',
    url: `/admin`,
  },
];

const shopStatisticsLinks: {
  name: string;
  url: string;
}[] = [
  { name: 'dispensed', url: '' },
  { name: 'purchases', url: 'purchases' },
  { name: 'requests', url: 'requests' },
  { name: 'received', url: 'received' },
  { name: 'inventories', url: 'inventories' },
];
export interface IStore {
  name: string;
  _id: string;
}
type StoresState = {
  stores: IStore[];
  selectedStore: IStore | null;
  isLoading: boolean;
};
const initialState: StoresState = {
  stores: [],
  selectedStore: {
    name: 'mainclinic',
    _id: '6815c9a685857d37ac651bcc',
  },
  isLoading: false,
};
export const OutletsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    donorStores: computed(() => {
      return state.stores().filter((item) => {
        return item._id != state.selectedStore()?._id;
      });
    }),
    storeLinks: computed(() => {
      return state.stores().map((item) => {
        return { url: `/shop/${item.name}/${item._id}`, name: item.name };
      });
    }),
    adminLinks: computed(() => {
      return adminLinks.map((item) => {
        return { url: `/admin/${item.name}`, name: item.name };
      });
    }),
    manageLinks: computed(() => {
      return manageLinks.map((item) => {
        return item;
      });
    }),
    shopLinks: computed(() => {
      if (!!state.selectedStore()) {
        const { name, _id } = state.selectedStore() as IStore;
        return shopLinks.map((item) => ({
          ...item,
          url: `/shop/${name}/${_id}/${item.url}`,
        }));
      }
      return [];
    }),
    shopStatisticsLinks: computed(() => {
      if (!!state.selectedStore()) {
        const { name, _id } = state.selectedStore() as IStore;
        return shopStatisticsLinks.map((item) => ({
          ...item,
          url: `/shop/${name}/${_id}/${item.url}`,
        }));
      }
      return [];
    }),
  })),

  withMethods(
    (
      store,
      storeService = inject(OutletService),
      logger = inject(LoggerService)
    ) => ({
      setSelectedStore(item?: IStore) {
        patchState(store, (state) => ({ ...state, selectedStore: item }));
        logger.log(`set store to ${item}`);
      },
      async getStores() {
        try {
          const res = await storeService.getStores();

          logger.log('stores fetched');
          patchState(store, (state) => ({ ...state, stores: res }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      findStore(identifier: string) {
        return store.stores().find((item) => {
          return item.name == identifier || item._id == identifier;
        }) as IStore;
      },
      async postStore(payload: Partial<IStore>) {
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
