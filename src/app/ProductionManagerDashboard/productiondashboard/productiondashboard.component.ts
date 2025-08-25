import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { DemandedProductsComponent } from "../demanded-products/demanded-products.component";
import { ScheduledProductsComponent } from '../scheduled-products/scheduled-products.component';
import { DeliveredProductsComponent } from '../delivered-products/delivered-products.component';
import { ProfileComponent } from '../../ProcurementDashboard/profile/profile.component';

@Component({
  selector: 'app-productiondashboard',
    standalone: true,
      imports: [
    RouterModule,
    CommonModule,
    DemandedProductsComponent,
    ScheduledProductsComponent,
    DeliveredProductsComponent,
    ProfileComponent
],
  templateUrl: './productiondashboard.component.html',
  styleUrl: './productiondashboard.component.css'
})
export class ProductiondashboardComponent implements OnInit {

  selectedTab: 'scheduled' | 'delivered' | 'stocks' | 'profile' = 'scheduled';
  demandedCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService // ⬅ inject
  ) {}

  ngOnInit() {
    this.loadDemandCount();

    // Optional: auto-refresh every 30 sec
    setInterval(() => {
      this.loadDemandCount();
    }, 30000);
  }

  loadDemandCount() {
    this.productService.getDemandedProductsCount().subscribe({
      next: (count) => {
        this.demandedCount = count;
      },
      error: (err) => {
        console.error('Error fetching demanded products count:', err);
      }
    });
  }

  Logout(): any {
    console.log("Inside Logout function");
    this.router.navigateByUrl('/');
  }
}
