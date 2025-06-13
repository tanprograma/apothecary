import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { inject } from '@angular/core';

import { LoggerService } from '../services/logger.service';

export interface Log {
  createdAt: string;
  message: string;
}
type LogsState = {
  logs: Log[];
};
const initialState: LogsState = {
  logs: [],
};
export const LogsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => {
    return {};
  }),
  withMethods(
    (
      store,

      logger = inject(LoggerService)
    ) => ({
      async getLogs() {
        const res = await logger.getLogs();
        patchState(store, (state) => ({ ...state, logs: res }));
      },
      async postLog(payload: Partial<Log>) {
        const { status, result } = await logger.serverLog(payload);
        if (!!result) {
          patchState(store, (state) => ({
            ...state,
            logs: [result, ...state.logs],
          }));
        }
      },
    })
  )
);
