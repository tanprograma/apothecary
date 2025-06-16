import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { SupplierStore } from '../../app-stores/supplier.store';

import { UnitStore } from '../../app-stores/unit.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'units',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss',
})
export class UnitsComponent {
  plusIcon = faAdd;
  formBuilder = inject(FormBuilder);
  unitStore = inject(UnitStore);
  notificationService = inject(Notification);
  form = this.formBuilder.group({
    unit: ['', Validators.required],
  });
  ngOnInit(): void {
    this.getUnits().then((res) => console.log('done'));
  }
  async submit() {
    const payload = { name: this.form.value.unit ?? '' };
    return this.unitStore.postUnit(payload);
  }
  async getUnits() {
    this.notificationService.updateNotification({
      message: 'initializing',
      loading: true,
    });
    await this.unitStore.getUnits();
    this.notificationService.reset();
  }
}
