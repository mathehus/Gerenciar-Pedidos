import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderListComponent } from './components/order-list/order-list.component'; // Importe o OrderListComponent
import { OrderFormComponent } from './components/order-form/order-form.component';


@Component({
  selector: 'app-root',
  standalone: true, // Se for um componente standalone
  imports: [FormsModule, OrderListComponent,OrderFormComponent], // Adicione OrderListComponent aqui
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Order Management';
}


