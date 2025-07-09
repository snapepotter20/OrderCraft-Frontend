import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Pre-fill from localStorage
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedUsername && savedPassword) {
      this.username = savedUsername;
      this.password = savedPassword;
      this.rememberMe = true;
    }
  }

  login() {
    this.errorMessage = '';
    this.loading = true;

    const credentials = btoa(`${this.username}:${this.password}`);
    localStorage.setItem('auth', credentials);

    if (this.rememberMe) {
      localStorage.setItem('rememberedUsername', this.username);
      localStorage.setItem('rememberedPassword', this.password);
    } else {
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedPassword');
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/welcome']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid credentials';
      }
    });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
