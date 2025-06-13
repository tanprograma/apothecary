import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';

import { LoggerService } from '../services/logger.service';
import { RequestsService } from '../services/requests.service';
import { DateService } from '../services/date.service';

export type RequestSummary = {
  product: string;
  unit: string;
  unit_value: number;
  quantity: number;
  price: number;
};

export interface IRequestItem {
  product: string;
  requested: number;
  received: number;
  unit: string;
  unit_value: number;
  price: number;
}
export interface IRequest {
  _id: string;
  destination: string;
  source: string;

  products: IRequestItem[];
  createdAt: string;
  completed: boolean;
}
export interface DisplayedRequest extends IRequestItem {
  date: string;
  time: string;
}
type State = {
  summary: RequestSummary[];
  requests: IRequest[];
  cart: IRequestItem[];
  issueCart: IRequestItem[];
  isLoading: boolean;
  showPrescriptionForm: boolean;
  filter: { product: string; category: string };
};
const initialState: State = {
  summary: [],
  requests: [],
  cart: [],
  issueCart: [],
  isLoading: false,
  showPrescriptionForm: false,
  filter: { product: '', category: '' },
};
export const RequestsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state, dateService = inject(DateService)) => {
    return {
      displayedSummary: computed(() => {
        //   get sales summary
        return state
          .summary()
          .filter((item) => {
            if (!!state.filter.product()) {
              return item.product.includes(state.filter.product());
            } else {
              return true;
            }
          })
          .filter((item) => {
            if (!!state.filter.category()) {
              return item.product.includes(state.filter.category());
            } else {
              return true;
            }
          });
      }),
      displayedRequests: computed(() => {
        //   get sales summary
        return state.requests().map((req) => {
          const { date, time } = dateService.parseDate(req.createdAt);
          return { ...req, createdAt: `${date} ${time}` };
        });
      }),
    };
  }),
  withMethods(
    (
      store,
      requestService = inject(RequestsService),
      dateService = inject(DateService),
      logger = inject(LoggerService)
    ) => ({
      async getRequestsSummary(options: { [key: string]: any }) {
        try {
          const res = await requestService.getRequestSummary(options);

          logger.log('sales summary fetched');
          patchState(store, (state) => ({ ...state, salesSummary: res }));
        } catch (error) {
          logger.log((error as { message: string }).message);
        }
      },
      async getStoreRequests(storeID: string, options: { [key: string]: any }) {
        try {
          const res = await requestService.getStoreRequests(storeID, options);

          logger.log('requests fetched');
          console.log(res);
          patchState(store, (state) => ({
            ...state,
            requests: res,
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

      async postRequest(sale: Partial<IRequest>) {
        const { status, result } = await requestService.postRequest(sale);
        console.log({ result, status });
        if (!!result) {
          // adds to sales
          logger.log('request posted successfully');
          const { date, time } = dateService.parseDate(result.createdAt);
          console.log(`${date} ${time}`);
          patchState(store, (state) => {
            // adds
            return {
              ...state,
              requests: [
                {
                  ...result,
                  products: state.cart,
                },
                ...state.requests,
              ],
            };
          });

          // restore the cart
          patchState(store, (state) => ({ ...state, cart: [] }));
        }

        return status;
      },
      async issueRequest(sale: Partial<IRequest>) {
        const { status } = await requestService.issueRequest(sale);
        console.log({ status });
        if (!!status) {
          // adds to sales
          logger.log('request issued successfully');
          // const { date, time } = dateService.parseDate(result.createdAt);
          patchState(store, (state) => {
            // mark as completed
            return {
              ...state,
              requests: state.requests.map((req) => {
                return req._id == sale._id
                  ? { ...req, completed: true, products: state.issueCart }
                  : req;
              }),
            };
          });
          // restore the cart
          patchState(store, (state) => ({ ...state, issueCart: [] }));
        }

        return status;
      },

      updateIssueCartItem(payload: Partial<IRequestItem>) {
        // can be used to update fields of items in cart
        patchState(store, (state) => ({
          ...state,
          issueCart: state.issueCart.map((item) => {
            return item.product == payload.product
              ? { ...item, ...payload }
              : item;
          }),
        }));
      },
      addToCart(item: IRequestItem) {
        patchState(store, (state) => ({
          ...state,
          cart: [...state.cart, item],
        }));
      },
      removeFromCart(item: IRequestItem) {
        patchState(store, (state) => ({
          ...state,
          cart: state.cart.filter((i) => i != item),
        }));
      },
      clearIssueCart() {
        patchState(store, (state) => ({ ...state, issueCart: [] }));
      },
      setIssueCart(items: IRequestItem[]) {
        patchState(store, (state) => ({ ...state, issueCart: items }));
      },
      toggleForm() {
        // shows or hides the sale-form
        patchState(store, (state) => ({
          ...state,
          showForm: !state.showPrescriptionForm,
        }));
      },
    })
  )
);
