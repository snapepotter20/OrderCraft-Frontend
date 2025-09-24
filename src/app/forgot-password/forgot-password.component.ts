import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewauthService } from '../services/newauth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  username: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  otpSent: boolean = false;

  constructor(private authService: NewauthService, private router: Router) {}

  sendOtp() {
    this.authService.sendOtp(this.username).subscribe({
      next: () => {
        this.otpSent = true;
        this.message = 'OTP sent to your registered email.';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to send OTP.';
        this.message = '';
      },
    });
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.verifyOtpAndResetPassword(
      this.username,
      this.otp,
      this.newPassword
    ).subscribe({
      next: () => {
        this.message = 'Password reset successfully. Redirecting to login...';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Reset failed';
        this.message = '';
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
