import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';
import { AdmindashboardComponent } from './AdminDashboard/admindashboard/admindashboard.component';
import { NewLoginComponent } from './login/login/login.component';
import { ProcurementdashboardComponent } from './ProcurementDashboard/procurementdashboard/procurementdashboard.component';
import { InventorydashboardComponent } from './InventoryManagerDashboard/inventorydashboard/inventorydashboard.component';
import { TrackOrderComponent } from './ProcurementDashboard/track-order/track-order.component';
import { ProductiondashboardComponent } from './ProductionManagerDashboard/productiondashboard/productiondashboard.component';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: NewLoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  // { path: 'welcome', component: WelcomepageComponent, canActivate: [AuthGuard]  },
  // { path: 'admin-dashboard', component: AdmindashboardComponent, canActivate: [AuthGuard]  },
  // { path: 'procurement-dashboard', component: ProcurementdashboardComponent, canActivate: [AuthGuard]  },
  // { path: 'inventory-dashboard', component: InventorydashboardComponent, canActivate: [AuthGuard]  },
  // { path: 'production-dashboard', component: ProductiondashboardComponent, canActivate: [AuthGuard]  },
  // { path: 'track-order/:id', component: TrackOrderComponent , canActivate: [AuthGuard] },
  {
    path: 'admin-dashboard',
    component: AdmindashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'procurement-dashboard',
    component: ProcurementdashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_PROCUREMENT_OFFICER'] },
  },
  {
    path: 'inventory-dashboard',
    component: InventorydashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_INVENTORY_MANAGER'] },
  },
  {
    path: 'production-dashboard',
    component: ProductiondashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_PRODUCTION_MANAGER'] },
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
