import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { inject } from '@angular/core';

import { LoggerService } from '../services/logger.service';

import { Product } from '../interfaces/product';
import { Unit } from '../interfaces/unit';
import { UnitService } from '../services/unit.service';

type ProductsState = {
  units: Unit[];
};
const initialState: ProductsState = {
  units: [],
};
export const UnitStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => {
    return {};
  }),
  withMethods(
    (
      store,
      unitService = inject(UnitService),

      logger = inject(LoggerService)
    ) => ({
      async getUnits() {
        const res = await unitService.getUnits();
        patchState(store, (state) => ({ ...state, units: res }));
      },
      async postUnit(payload: Partial<Product>) {
        const { status, result } = await unitService.postUnit(payload);
        if (!!result) {
          patchState(store, (state) => ({
            ...state,
            units: [result, ...state.units],
          }));
        }
      },
    })
  )
);
