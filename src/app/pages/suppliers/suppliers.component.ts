import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupplierStore } from '../../app-stores/supplier.store';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'suppliers',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent {
  plusIcon = faAdd;
  formBuilder = inject(FormBuilder);
  supplierStore = inject(SupplierStore);
  notificationService = inject(NotificationService);
  form = this.formBuilder.group({
    store: ['', Validators.required],
  });
  ngOnInit(): void {
    this.getStores().then((res) => console.log('done'));
  }
  async submit() {
    const payload = { name: this.form.value.store ?? '' };
    return this.supplierStore.postStore(payload);
  }
  async getStores() {
    this.notificationService.updateNotification({
      message: 'initializing',
      loading: true,
    });
    await this.supplierStore.getStores();
    this.notificationService.reset();
  }
}
