import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NewauthService } from '../../services/newauth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class NewLoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  isLocked: boolean = false;
  lockMessage: string = '';
  failedAttempts: number = 0;
  maxAttempts: number = 3;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: NewauthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isLocked) return;

    this.loading = true;
    this.errorMessage = '';
    this.lockMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.failedAttempts = 0;
        this.isLocked = false;

        const token = res.token;
        localStorage.setItem('token', token);
        const role = this.authService.getUserRoleFromToken(token);

        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'ROLE_PROCUREMENT_OFFICER') {
          this.router.navigate(['/procurement-dashboard']);
        } else if (role === 'ROLE_INVENTORY_MANAGER') {
          this.router.navigate(['/inventory-dashboard']);
        } else if (role === 'ROLE_PRODUCTION_MANAGER') {
          this.router.navigate(['/production-dashboard']);
        }
         else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.error || 'Login failed';

        if (errorMsg.toLowerCase().includes('account has been locked')) {
          this.isLocked = true;
          this.lockMessage = errorMsg;
        } else {
          this.failedAttempts++;
          const remaining = this.maxAttempts - this.failedAttempts;

          if (this.failedAttempts >= this.maxAttempts) {
            this.isLocked = true;
            this.lockMessage =
              'Account is locked due to 3 failed login attempts. Please try again after 12 hours.';
          } else {
            this.errorMessage = `Invalid credentials. You have <strong>${remaining}</strong> attempt${
              remaining > 1 ? 's' : ''
            } left.`;
          }
        }
      },
    });
  }

    navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
