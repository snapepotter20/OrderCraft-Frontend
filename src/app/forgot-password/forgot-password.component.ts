import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // adjust path if needed
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  username: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.resetPassword(this.username, this.newPassword).subscribe({
      next: () => {
        this.message = 'Password reset successfully. Redirecting to login...';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Reset failed';
      },
    });
  }
    goToLogin() {
    this.router.navigate(['/']);
  }
}
