import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NewauthService } from '../../services/newauth.service';
// import { CreateInventoryTransactionComponent } from '../create-inventory-transaction/create-inventory-transaction.component';
// import { ViewInventoryTransactionsComponent } from '../view-inventory-transactions/view-inventory-transactions.component';
// import { ViewAllProductsComponent } from '../view-all-products/view-all-products.component';
// import { TabService } from '../../services/InventoryServices/tab.service';
// import { ProfileComponent } from "../profile/profile.component";
// import { ViewCompletedOrdersComponent} from '../view-completed-orders-component/view-completed-orders-component.component';
// import { ViewRequestedOrdersComponent } from '../view-requested-orders-component/view-requested-orders-component.component';

@Component({
  selector: 'app-inventorydashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    // CreateInventoryTransactionComponent,
    // ViewInventoryTransactionsComponent,
    // ViewAllProductsComponent,
    // ProfileComponent,
    // ViewCompletedOrdersComponent,
    // ViewRequestedOrdersComponent
],
  templateUrl: './inventorydashboard.component.html',
  styleUrl: './inventorydashboard.component.css',
})
export class InventorydashboardComponent implements OnInit {
  selectedTab: 'create' | 'view' | 'products' | 'profile' = 'create';

  constructor(
    // private tabService: TabService,
     private cdr: ChangeDetectorRef,private authService: NewauthService, private router: Router) {}

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
