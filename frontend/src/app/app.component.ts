import { Component } from '@angular/core';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  imports: [OrderFormComponent, OrderListComponent, FormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Order Management';
}
