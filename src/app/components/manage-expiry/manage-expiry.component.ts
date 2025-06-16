import { Component, inject } from '@angular/core';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { IInventory, InventoriesStore } from '../../app-stores/inventory.store';
import { RequestAllertStore } from '../../app-stores/request-allert.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../interfaces/product';
import { IStore } from '../../app-stores/outlet.store';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'manage-expiry',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './manage-expiry.component.html',
  styleUrl: './manage-expiry.component.scss',
})
export class ManageExpiryComponent {
  formBuilder = inject(FormBuilder);
  notification = inject(Notification);
  form = this.formBuilder.group({
    expiry: ['', Validators.required],
  });
  plusIcon = faAdd;

  inventoriesStore = inject(InventoriesStore);

  reqState = inject(RequestAllertStore);
  async submit() {
    const date = new Date(this.form.value.expiry ?? '').toISOString();
    const { _id } = this.inventoriesStore.selectedInventory() as IInventory<
      Product,
      IStore
    >;
    this.notification.updateNotification({
      message: 'setting expiry date',
      loading: true,
    });
    const status = await this.inventoriesStore.updateInventory<boolean>({
      type: 'expiry',
      payload: { expiry: date, _id },
    });
    if (!!status) {
      this.notification.updateNotification({
        message: 'expiry set successfully',
        status,
      });
    } else {
      this.notification.updateNotification({
        message: 'action failed',
        status,
      });
    }
  }
}
