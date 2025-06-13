import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
// import { any } from '../../app-stores/sale.store';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'cart',
  imports: [FontAwesomeModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  crossIcon = faTimes;
  @Input() cartItems!: any[];
  @Output() onRemove = new EventEmitter<any>();
  removeFromCart(item: any) {
    this.onRemove.emit(item);
  }
}
