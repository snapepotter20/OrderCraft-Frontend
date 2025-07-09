import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'welcome', component: WelcomepageComponent, canActivate: [AuthGuard]  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
