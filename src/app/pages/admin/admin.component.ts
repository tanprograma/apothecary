import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DropdownLinksComponent } from '../../components/dropdown-links/dropdown-links.component';
import { OutletsStore } from '../../app-stores/outlet.store';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, DropdownLinksComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  // document = inject(DOCUMENT);
  outletStore = inject(OutletsStore);

  appLinks = [
    { url: '/admin', name: 'admin' },
    { url: '/home', name: 'home' },
  ];

  ngOnInit(): void {
    // this.authenticate();
  }
  // authenticate() {
  //   const user = this.shopService.getCurrentUser();
  //   if (user != undefined && user.role == 'admin') {
  //     return;
  //   } else {
  //     this.shopService.logOut();
  //   }
  // }
}
