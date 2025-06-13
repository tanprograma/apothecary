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
export interface IInventory<
  T extends Product | string,
  K extends IStore | string
> {
  _id: string;
  store: K;
  product: T;
  quantity: number;
  prices: { unit: string; value: number }[];
  expiry: string;
}
type InventoryState = {
  inventorySummary: InventorySummary[];
  inventory: IInventory<Product, IStore>[];
  selectedInventory: null | IInventory<Product, IStore>;
  isLoading: boolean;
  filter: { product: string; category: string };
};
const initialState: InventoryState = {
  inventorySummary: [],
  selectedInventory: null,
  inventory: [],
  isLoading: false,
  filter: { product: '', category: '' },
};
export const InventoriesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => {
    return {
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
    };
  }),
  withMethods(
    (
      store,
      inventoryService = inject(InventoryService),
      dateService = inject(DateService),
      logger = inject(LoggerService)
    ) => ({
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
