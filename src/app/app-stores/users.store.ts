import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';

import { LoggerService } from '../services/logger.service';

import { User } from '../interfaces/user';
import { UsersService } from '../services/users.service';
import { NotificationService } from '../services/notification.service';

type UsersState = {
  users: User[];
  loggedUser: Partial<User> | null;
};
const initialState: UsersState = {
  users: [],
  loggedUser: null,
};
export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => {
    return {};
  }),
  withMethods(
    (
      store,
      usersService = inject(UsersService),
      notificationService = inject(NotificationService),
      logger = inject(LoggerService)
    ) => ({
      async getUsers() {
        const res = await usersService.getUsers();
        patchState(store, (state) => ({ ...state, users: res }));
      },
      async postUser(payload: Partial<User>) {
        const { status, result } = await usersService.postUser(payload);
        if (!!result) {
          patchState(store, (state) => ({
            ...state,
            users: [result, ...state.users],
          }));
        }
      },
      async login(payload: Partial<User>) {
        const { status, result } = await usersService.login(payload);
        if (!!result) {
          patchState(store, (state) => ({
            ...state,
            loggedUser: result,
          }));

          usersService.setSession(result);
        }
      },
      logOut() {
        patchState(store, (state) => ({ ...state, loggedUser: null }));
        usersService.clearSession();
        usersService.router.navigate(['/login']);
      },
      restoreSession() {
        const { status, user } = usersService.getSession();
        if (!!user) {
          patchState(store, (state) => ({
            ...state,
            loggedUser: user,
          }));
        }
      },
    })
  )
);
