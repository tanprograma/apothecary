import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  faAdd,
  faAngleDown,
  faAngleUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { IInventory, InventoriesStore } from '../../app-stores/inventory.store';
import { IStore, OutletsStore } from '../../app-stores/outlet.store';
import { Notification } from '../../app-stores/notification.store';
import { Product } from '../../interfaces/product';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { TracerService } from '../../services/tracer.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tracer-form',
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    SearchBoxComponent,
    RouterLink,
  ],
  templateUrl: './tracer-form.component.html',
  styleUrl: './tracer-form.component.scss',
})
export class TracerFormComponent {
  plusIcon = faAdd;
  angleDown = faAngleDown;
  angleUp = faAngleUp;
  crossIcon = faTimes;
  showMoreItems = true;
  showStockTakingForm = false;

  units: { name: string; value: number }[] = [];

  inventoriesStore = inject(InventoriesStore);

  // for state management of the request
  reqState = inject(Notification);
  outletStore = inject(OutletsStore);
  tracerService = inject(TracerService);
  // tracersStore = inject(TracersStore);

  formBuilder = inject(FormBuilder);
  tracerForm = this.formBuilder.group({
    created_on: ['', Validators.required],
  });
  toggleCart() {
    this.showMoreItems = !this.showMoreItems;
  }
  toggleStockTakingForm() {
    this.showStockTakingForm = !this.showStockTakingForm;
  }

  async setTracerDate() {
    const status = await this.tracerService.postTracerDate({
      name: this.outletStore.selectedStore()?.name ?? '',
      stock_taking: new Date(
        this.tracerForm.value.created_on ?? ''
      ).toISOString(),
    });
    if (!!status) {
      this.reqState.updateNotification({
        message: 'tracer successfully saved',
        status,
      });

      this.tracerForm.patchValue({
        created_on: '',
      });
      this.toggleStockTakingForm();
    } else {
      this.reqState.updateNotification({
        message: 'could not save the tracer',
        status: false,
      });
    }
  }
  filterTracers(predicate: string) {
    this.inventoriesStore.updateFilter({ product: predicate });
  }
  async setTracer(event: Event, _id: string) {
    // dispenses the item
    const tracer = (event.target as HTMLInputElement).value;
    this.inventoriesStore.setTracer({
      _id,
      tracer: parseInt(tracer as string),
    });
  }
  async saveTracer(item: IInventory<Product, IStore>) {
    // dispenses the item

    const status = await this.inventoriesStore.postTracer({
      tracer: item.tracer as number,
      _id: item._id,
    });
    if (!!status) {
      this.reqState.updateNotification({
        message: 'tracer successfully saved',
        status,
      });
    } else {
      this.reqState.updateNotification({
        message: 'could not save the tracer',
        status: false,
      });
    }
  }
}
