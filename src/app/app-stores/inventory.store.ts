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
import { TracerReport } from '../interfaces/tracer';
import { TracerService } from '../services/tracer.service';

export type InventorySummary = {
  product: string;
  unit: string;
  unit_value: number;
  quantity: number;
  amount: number;
};

// export interface IInventoryItem {
//   product: string;
//   quantity: number;
//   unit: string;
//   unit_value: number;;oa
//   price: number;
// }
export interface Info extends Pick<InventoryInfo, 'amount' | 'items'> {
  // summary of info

  category: string;
  orders: number;
}
export interface InventoryInfo {
  // aggregates inventory info
  quantity: number;
  amount: number;
  items: number;
}
export interface IInventory<
  T extends Product | string,
  K extends IStore | string
> {
  //inventory type
  _id: string;
  store: K;
  product: T;
  tracer?: number;
  created_on?: string;
  quantity: number;
  sales: InventoryInfo;
  purchases: InventoryInfo;
  receive: InventoryInfo;
  issue: InventoryInfo;
  prices: { unit: string; value: number }[];
  expiry: string;
}
export interface InfoSummary {
  sales: Info;
  purchases: Info;
  receive: Info;
  issue: Info;
}
type InventoryState = {
  inventorySummary: InventorySummary[];
  inventory: IInventory<Product, IStore>[];
  infos: Info[];
  tracers: TracerReport[];
  tracerFilter: string;
  selectedInventory: null | IInventory<Product, IStore>;
  isLoading: boolean;
  filter: { product: string; category: string };
};
const initialState: InventoryState = {
  inventorySummary: [],
  tracers: [],
  tracerFilter: '',
  selectedInventory: null,
  inventory: [],
  infos: [],

  isLoading: false,
  filter: { product: '', category: '' },
};
export const InventoriesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => {
    return {
      displayedTracers: computed(() => {
        //   get sales summary
        return state.tracers().filter((tracer) => {
          if (!!state.tracerFilter()) {
            return tracer.product.includes(state.tracerFilter().toLowerCase());
          } else {
            return true;
          }
        });
      }),
      displayedInventories: computed(() => {
        //   get sales summary
        return state
          .inventory()
          .map((sale) => {
            let isExpired = false;
            let expiry = sale.expiry;
            if (expiry != 'not set' && expiry != undefined) {
              const now = Date.now();
              const exp_date = new Date(expiry);
              expiry = `
              ${exp_date.getDate()}/${
                exp_date.getMonth() + 1
              }/${exp_date.getFullYear()}`;
              const exp = exp_date.getTime();
              const remaining_days = exp - now;
              // 3 month benchmark
              const _benchmark = 1000 * 60 * 60 * 24 * 30 * 3;
              if (remaining_days < _benchmark) {
                isExpired = true;
              }
            }
            return { ...sale, isExpired, expiry };
          })
          .filter((sale) => {
            if (!!state.filter.product()) {
              return sale.product.name.includes(
                state.filter.product().toLowerCase()
              );
            } else {
              return true;
            }
          });
      }),
      displayedInventorySummary: computed(() => {
        //   get sales summary
        return state
          .inventorySummary()
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
      salesInfo: computed(() => {
        //   get sales summary
        return state.infos().find((item) => item.category == 'sales');
      }),
      purchasesInfo: computed(() => {
        //   get sales summary
        return state.infos().find((item) => item.category == 'purchases');
      }),
      issueInfo: computed(() => {
        //   get sales summary
        return state.infos().find((item) => item.category == 'issue');
      }),
      receiveInfo: computed(() => {
        //   get sales summary
        return state.infos().find((item) => item.category == 'receive');
      }),
    };
  }),
  withMethods(
    (
      store,
      inventoryService = inject(InventoryService),
      tracerService = inject(TracerService),
      dateService = inject(DateService),
      logger = inject(LoggerService)
    ) => ({
      updateFilter(payload: Partial<{ product: string; category: string }>) {
        patchState(store, (state) => ({
          ...state,
          filter: { ...state.filter, ...payload },
        }));
      },
      findProduct(option: string) {
        return store.inventory().find((item) => {
          return item.product.name == option || item.product._id == option;
        })?.product as Product;
      },
      async getInventorySummary(options: { [key: string]: any }) {
        try {
          const res = await inventoryService.getInventoriesSummary(options);
          // console.log(res[0]);
          // logger.log('inventory summary fetched');
          patchState(store, (state) => ({ ...state, inventorySummary: res }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      async getInfoSummary() {
        try {
          const res = await inventoryService.getInfo();

          // logger.log('inventory summary fetched');
          patchState(store, (state) => ({ ...state, infos: res }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      async getInventory(storeID?: string) {
        if (!!storeID) {
          try {
            const res = await inventoryService.getInventory(storeID);

            logger.log('inventory summary fetched');
            patchState(store, (state) => ({ ...state, inventory: res }));
          } catch (error) {
            logger.log((error as { message: string }).message);
          }
        }
        return;
      },
      setTracerFilter(filter: string) {
        patchState(store, (state) => ({ ...state, tracerFilter: filter }));
      },
      async getTracers() {
        const res = await tracerService.getTracers();
        patchState(store, (state) => ({ ...state, tracers: res }));
      },
      async postTracer(payload: {
        value: number;
        created_on: string;
        store: string;
        product: string;
      }) {
        const { status, result } = await tracerService.postTracer(payload);
        if (!!result) {
          const found = store
            .tracers()
            .find((item) => item.product == result.product);
          if (!found) {
            patchState(store, (state) => ({
              ...state,
              tracers: [result, ...state.tracers],
            }));
          } else {
            patchState(store, (state) => ({
              ...state,
              tracers: state.tracers.map((tracer) => {
                return tracer.product == result.product
                  ? {
                      ...tracer,
                      quantity: result.quantity,
                      created_on: result.created_on,
                    }
                  : tracer;
              }),
            }));
          }
        }
        return status;
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
      setSelectedInvetory(item: IInventory<Product, IStore> | null) {
        patchState(store, (state) => ({ ...state, selectedInventory: item }));
      },
      async updateInventory<T>(action: {
        type: 'expiry' | 'quantity' | 'price';
        payload: unknown;
      }): Promise<T> {
        let selectedInventory = store.selectedInventory();
        switch (action.type) {
          case 'expiry':
            const expiry_response = await inventoryService.updateExpiry(
              action.payload as Partial<IInventory<Product, IStore>>
            );
            if (!!expiry_response.status && !!selectedInventory) {
              let expiryDate = (
                action.payload as Partial<IInventory<Product, IStore>>
              ).expiry;
              patchState(store, (state) => ({
                ...state,
                selectedInventory: {
                  ...selectedInventory,
                  expiry: dateService.parseDate(expiryDate).date,
                },
              }));
            }
            return expiry_response.status as T;
          case 'quantity':
            let quantity_response = await inventoryService.updateQuantity(
              action.payload as Partial<IInventory<Product, IStore>>
            );
            if (!!quantity_response.status && !!selectedInventory) {
              let quantity = (
                action.payload as Partial<IInventory<Product, IStore>>
              ).quantity as number;
              patchState(store, (state) => ({
                ...state,
                selectedInventory: {
                  ...selectedInventory,
                  quantity: quantity + selectedInventory.quantity,
                },
              }));
            }
            return quantity_response.status as T;
          case 'price':
            let price_response = await inventoryService.updatePrice(
              action.payload as {
                _id: string;
                price: { unit: string; value: number };
              }
            );
            return price_response.status as T;

          default:
            return false as T;
        }
      },
    })
  )
);
