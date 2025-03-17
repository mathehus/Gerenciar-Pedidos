import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent {
  customer = '';
  items = [{ product: '', quantity: 1, price: 0 }];

  constructor(private orderService: OrderService) {}

  addItem() {
    this.items.push({ product: '', quantity: 1, price: 0 });
  }

  createOrder() {
    const order = { customer: this.customer, items: this.items };
    this.orderService.createOrder(order).subscribe(() => {
      alert('Pedido criado!');
      this.customer = '';
      this.items = [{ product: '', quantity: 1, price: 0 }];
    });
  }
}
