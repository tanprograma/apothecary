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
  withMethods((store, usersService = inject(UsersService)) => ({
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
      return status;
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
      return status;
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
      return status;
    },
    authenticated() {
      return !!this.restoreSession();
    },
    routeToLogin() {
      usersService.router.navigate(['/login']);
    },
  }))
);
