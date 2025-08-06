import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

interface Role {
  role_id: number;
  roleName: string;
}

@Component({
  selector: 'app-createuser',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css',
})
export class CreateuserComponent implements OnInit {
  userForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  roles: Role[] = [];
  

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:"\\\\|,.<>\\/?]).{8,}$'
          ),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phoneno: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      role: ['', Validators.required],
      address: this.fb.group({
        addressStreet: ['', Validators.required],
        addressCity: ['', Validators.required],
        addressState: ['', Validators.required],
        addressPostalCode: [
          '',
          [Validators.required, Validators.pattern(/^\d{5,6}$/)],
        ],
        addressCountry: ['', Validators.required],
      }),
    });

    this.fetchRoles();
  }

  fetchRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data: Role[]) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Failed to fetch roles', err);
        this.errorMessage = 'Failed to load roles';
      },
    });
  }

  onSubmit(): void {
     console.log('Form Submitted!', this.userForm.value);
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.value;

    const payload = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phoneno: formData.phoneno,
      role: {
        role_id: formData.role,
      },
      address: {
        addressStreet: formData.address.addressStreet,
        addressCity: formData.address.addressCity,
        addressState: formData.address.addressState,
        addressPostalCode: formData.address.addressPostalCode,
        addressCountry: formData.address.addressCountry,
      },
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.successMessage = 'User created successfully!';
        this.errorMessage = '';
        this.userForm.reset();
      },
      error: (err) => {
        console.error('Create user error:', err);
        this.errorMessage = err.error?.error || 'Failed to create user';
        this.successMessage = '';
      },
    });
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  enforceMaxLength(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.value.length > 10) {
    input.value = input.value.slice(0, 10);
    this.userForm.get('phoneno')?.setValue(input.value);
  }
}

isFieldInvalid(fieldPath: string): boolean {
  const control = this.userForm.get(fieldPath);
  return !!(control && control.invalid && (control.dirty || control.touched));
}


}
