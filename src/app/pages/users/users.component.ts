import { Component, inject } from '@angular/core';
import { UsersStore } from '../../app-stores/users.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../../services/notification.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { User } from '../../interfaces/user';

@Component({
  selector: 'users',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  plusIcon = faAdd;
  formBuilder = inject(FormBuilder);
  usersStore = inject(UsersStore);
  notificationService = inject(NotificationService);
  form = this.formBuilder.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', Validators.required],
    role: ['', Validators.required],
    email: ['', Validators.required],
  });
  ngOnInit(): void {
    this.getUsers().then((res) => console.log('done'));
  }
  async submit() {
    const payload: Partial<User> = {
      firstname: this.form.value.firstname ?? '',
      lastname: this.form.value.lastname ?? '',
      email: this.form.value.email ?? '',
      role: (this.form.value.role ?? '') as 'admin' | 'other',
      password: this.form.value.password ?? '',
    };
    return this.usersStore.postUser(payload);
  }
  async getUsers() {
    this.notificationService.updateNotification({
      message: 'initializing',
      loading: true,
    });
    await this.usersStore.getUsers();
    this.notificationService.reset();
  }
}
