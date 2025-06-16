import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { OutletsStore } from '../../app-stores/outlet.store';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'stores',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss',
})
export class StoresComponent implements OnInit {
  plusIcon = faAdd;
  formBuilder = inject(FormBuilder);
  outletStore = inject(OutletsStore);
  notificationService = inject(Notification);
  form = this.formBuilder.group({
    store: ['', Validators.required],
  });
  ngOnInit(): void {
    this.getStores().then((res) => console.log('done'));
  }
  async submit() {
    const payload = { name: this.form.value.store ?? '' };
    return this.outletStore.postStore(payload);
  }
  async getStores() {
    this.notificationService.updateNotification({
      message: 'initializing',
      loading: true,
    });
    await this.outletStore.getStores();
    this.notificationService.reset();
  }
}
