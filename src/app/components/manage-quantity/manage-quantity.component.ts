import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { InventoriesStore, IInventory } from '../../app-stores/inventory.store';
import { IStore } from '../../app-stores/outlet.store';
import { RequestAllertStore } from '../../app-stores/request-allert.store';
import { Product } from '../../interfaces/product';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'manage-quantity',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './manage-quantity.component.html',
  styleUrl: './manage-quantity.component.scss',
})
export class ManageQuantityComponent {
  formBuilder = inject(FormBuilder);
  notification = inject(Notification);
  form = this.formBuilder.group({
    quantity: [0, Validators.required],
  });
  plusIcon = faAdd;

  inventoriesStore = inject(InventoriesStore);

  reqState = inject(RequestAllertStore);
  async submit() {
    const quantity = this.form.value.quantity ?? 0;
    const { _id } = this.inventoriesStore.selectedInventory() as IInventory<
      Product,
      IStore
    >;
    this.notification.updateNotification({
      message: 'setting quantity',
      loading: true,
    });
    const status = await this.inventoriesStore.updateInventory<boolean>({
      type: 'quantity',
      payload: { quantity, _id },
    });
    if (!!status) {
      this.notification.updateNotification({
        message: 'quantity set successfully',
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
