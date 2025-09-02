import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NewauthService } from '../../services/newauth.service';
import { ViewStocksComponent } from '../view-stocks/view-stocks.component';
import { ProfileComponent } from '../../ProcurementDashboard/profile/profile.component';
import { ViewRequestedOrdersComponent } from '../view-requested-orders-component/view-requested-orders-component.component';
import { ViewCompletedOrdersComponent } from '../view-completed-orders-component/view-completed-orders-component.component';
import { InventoryTransactionsComponent } from '../inventory-transactions/inventory-transactions.component';
import { ReturnedOrdersComponent } from '../returned-orders/returned-orders.component';

@Component({
  selector: 'app-inventorydashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ViewStocksComponent,
    ProfileComponent,
    ViewCompletedOrdersComponent,
    ViewRequestedOrdersComponent,
    InventoryTransactionsComponent,
    ReturnedOrdersComponent
  ],
  templateUrl: './inventorydashboard.component.html',
  styleUrl: './inventorydashboard.component.css',
})
export class InventorydashboardComponent implements OnInit {
  selectedTab:
    | 'inventorytransactions'
    | 'requestedorders'
    | 'completedorders'
    | 'returnedorders'
    | 'stocks'
    | 'profile' = 'inventorytransactions';

  constructor(
    // private tabService: TabService,
    private cdr: ChangeDetectorRef,
    private authService: NewauthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.tabService.selectedTab$.subscribe((tab) => {
    //   this.selectedTab = tab as any;
    //   this.cdr.detectChanges();
    // });
  }
  Logout(): any {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
