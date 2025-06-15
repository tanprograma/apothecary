import { Component, inject } from '@angular/core';
import { ExpiryFormComponent } from '../../components/expiry-form/expiry-form.component';
import { CurrencyPipe } from '@angular/common';
import { ExpiryStore } from '../../app-stores/expiry.store';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { OutletsStore } from '../../app-stores/outlet.store';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'expiry',
  imports: [ExpiryFormComponent, CurrencyPipe],
  templateUrl: './expiry.component.html',
  styleUrl: './expiry.component.scss',
})
export class ExpiryComponent {
  plusIcon = faAdd;
  outletStore = inject(OutletsStore);
  expiryStore = inject(ExpiryStore);
  notificationService = inject(NotificationService);
  ngOnInit(): void {
    this.getExpired();
  }
  getExpired() {
    // this.notificationService.updateNotification({
    //   loading: true,
    //   message: 'getting expiry data',
    // });
    this.expiryStore
      .getExpiry(this.outletStore.selectedStore()?._id as string)
      .then((res) => {
        // this.notificationService.reset();
      })
      .catch((err) => {
        // this.notificationService.updateNotification({
        //   status: false,
        //   message: 'could not load expiry data',
        // });
      });
  }
}
