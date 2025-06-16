import { Component, inject } from '@angular/core';
import { ProductsStore } from '../../app-stores/products.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

import { toNamespacedPath } from 'node:path';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UnitStore } from '../../app-stores/unit.store';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'products',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  plusIcon = faAdd;
  formBuilder = inject(FormBuilder);
  productsStore = inject(ProductsStore);
  unitsStore = inject(UnitStore);
  notificationService = inject(Notification);
  form = this.formBuilder.group({
    name: ['', Validators.required],
    unit: ['', Validators.required],
    value: [0, Validators.required],
  });

  units: { name: string; value: number }[] = [];
  ngOnInit(): void {
    this.initialize().then((res) => console.log('done'));
  }
  async submit() {
    const payload = { name: this.form.value.name ?? '', unit: this.units };
    await this.productsStore.postProduct(payload);
    this.units = [];
    this.form.patchValue({ name: '', unit: '', value: 0 });
  }
  async initialize() {
    this.notificationService.updateNotification({
      message: 'initializing',
      loading: true,
    });
    await Promise.all([
      this.unitsStore.getUnits(),
      this.productsStore.getProducts(),
    ]);
    this.notificationService.reset();
  }

  addUnit() {
    const unit = {
      name: this.form.value.unit ?? '',
      value: this.form.value.value ?? 0,
    };
    this.units.push(unit);
  }
}
