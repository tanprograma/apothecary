import { Component, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';

import { UpperCasePipe } from '@angular/common';
import { User } from '../../interfaces/user';
import { UsersStore } from '../../app-stores/users.store';

@Component({
  selector: 'user',
  standalone: true,
  imports: [FontAwesomeModule, UpperCasePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  userIcon = faUser;
  logoutIcon = faSignOut;
  userStore = inject(UsersStore);

  logOut() {
    this.userStore.logOut();
  }
}
