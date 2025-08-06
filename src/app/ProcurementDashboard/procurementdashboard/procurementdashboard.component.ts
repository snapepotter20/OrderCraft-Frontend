import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ViewOrderComponent } from '../view-order/view-order.component';
import { CreateOrderComponent } from '../create-order/create-order.component';

@Component({
  selector: 'app-procurementdashboard',
   standalone: true,
    imports: [
      RouterModule,
      CommonModule,
      CreateOrderComponent,
      ViewOrderComponent,
      // ProfileComponent,
    ],
  templateUrl: './procurementdashboard.component.html',
  styleUrl: './procurementdashboard.component.css'
})
export class ProcurementdashboardComponent {
    selectedTab: 'create' | 'view' | 'profile' = 'create';
  
    constructor(private authService: AuthService, private router: Router) {}
  
    Logout(): any {
      console.log("Inside Logout funtion");
      this.router.navigateByUrl('/');
    }
}
