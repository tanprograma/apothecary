import { Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  IRequest,
  IRequestItem,
  RequestsStore,
} from '../../app-stores/transfers.store';
import { OutletsStore } from '../../app-stores/outlet.store';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { FormControl } from '@angular/forms';
import { RequestAllertStore } from '../../app-stores/request-allert.store';

@Component({
  selector: 'request-view',
  imports: [FontAwesomeModule],
  templateUrl: './request-view.component.html',
  styleUrl: './request-view.component.scss',
})
export class RequestViewComponent {
  @Input() request!: IRequest;

  lessIcon = faAngleUp;
  moreIcon = faAngleDown;
  envelopIcon = faEnvelope;

  outletStore = inject(OutletsStore);

  showMore = false;
  toggleMore() {
    this.showMore = !this.showMore;
  }
}
