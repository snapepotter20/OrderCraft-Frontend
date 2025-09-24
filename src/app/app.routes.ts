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

export const routes: Routes = [
  // { path: '', component: LoginComponent },
  { path: '', component: NewLoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'welcome', component: WelcomepageComponent, canActivate: [AuthGuard]  },
  { path: 'admin-dashboard', component: AdmindashboardComponent, canActivate: [AuthGuard]  },
  { path: 'procurement-dashboard', component: ProcurementdashboardComponent, canActivate: [AuthGuard]  },
  { path: 'inventory-dashboard', component: InventorydashboardComponent, canActivate: [AuthGuard]  },
  { path: 'production-dashboard', component: ProductiondashboardComponent, canActivate: [AuthGuard]  },
  { path: 'track-order/:id', component: TrackOrderComponent , canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
