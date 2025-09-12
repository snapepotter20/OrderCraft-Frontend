import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

interface Role {
  role_id: number;
  roleName: string;
}

interface User {
  user_id: number;
  username: string;
  email: string;
  phoneno: string;
  password?: string;
  role: Role;
  action1?: string;
  action2?: string;
  accountLockedUntil?: string | null;
}

@Component({
  selector: 'app-viewuser',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './viewuser.component.html',
  styleUrl: './viewuser.component.css',
})
export class ViewuserComponent implements OnInit {
  allusers: User[] = [];
  roles: Role[] = [];

  isEditModalOpen = false;
  editForm!: FormGroup;
  selectedUserId: number | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.fetchAllUsers();
    this.fetchAllRoles();

    this.editForm = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneno: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      role: ['', Validators.required],
    });
  }

  fetchAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allusers = data;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      },
    });
  }

  fetchAllRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Failed to fetch roles', err);
      },
    });
  }

  onEdit(user: User): void {
    this.isEditModalOpen = true;
    this.selectedUserId = user.user_id;

    this.editForm.patchValue({
      username: user.username,
      email: user.email,
      password: '',
      phoneno: user.phoneno,
      role: user.role.role_id,
    });
  }

  // onDelete(user: User): void {
  //   this.userService.deleteUser(user.user_id).subscribe({
  //     next: () => this.fetchAllUsers(),
  //     error: (err) => console.error('Delete failed', err)
  //   });
  // }

  onDelete(user: any): void {
    const confirmed = confirm(
      `Are you sure you want to delete user "${user.username}"?`
    );
    if (confirmed) {
      // Call the delete API or service
      this.userService.deleteUser(user.user_id).subscribe({
        next: () => {
          alert(`User "${user.username}" deleted successfully.`);
          // Refresh user list or remove the user from the array
          this.allusers = this.allusers.filter(
            (u) => u.user_id !== user.user_id
          );
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user. Please try again.');
        },
      });
    }
  }

  onUpdate(): void {
    if (this.selectedUserId !== null && this.editForm.valid) {
      const updatedUser = {
        ...this.editForm.value,
        role: { role_id: this.editForm.value.role },
      };

      this.userService.updateUser(this.selectedUserId, updatedUser).subscribe({
        next: () => {
          this.fetchAllUsers();
          this.isEditModalOpen = false;
        },
        error: (err) => {
          console.error('Update failed', err);
        },
      });
    }
  }

  closeModal() {
    this.isEditModalOpen = false;
  }

  isUserLocked(user: User): boolean {
    if (!user.accountLockedUntil) return false;
    const lockedUntil = new Date(user.accountLockedUntil);
    return lockedUntil > new Date();
  }

  onUnlockClick(user: User): void {
    if (this.isUserLocked(user)) {
      const confirmed = window.confirm(
        `Are you sure you want to unlock ${user.username}'s account?`
      );
      if (confirmed) {
        this.toggleLockout(user);
      }
    }
  }

  toggleLockout(user: User): void {
    if (this.isUserLocked(user)) {
      this.userService.unlockUser(user.user_id).subscribe({
        next: () => {
          alert(`User ${user.username} unlocked successfully`);
          this.fetchAllUsers();
        },
        error: () => {
          alert(`Failed to unlock user ${user.username}`);
        },
      });
    } else {
      alert('User is already active');
    }
  }

  // ✨ Allow only numbers on keypress
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onToggleLockClick(user: User): void {
    if (this.isUserLocked(user)) {
      // Unlock flow
      const confirmed = window.confirm(
        `Are you sure you want to unlock ${user.username}'s account?`
      );
      if (confirmed) {
        this.userService.unlockUser(user.user_id).subscribe({
          next: () => {
            alert(`User ${user.username} unlocked successfully`);
            this.fetchAllUsers();
          },
          error: () => {
            alert(`Failed to unlock user ${user.username}`);
          },
        });
      }
    } else {
      // Lock flow
      const confirmed = window.confirm(
        `Are you sure you want to lock ${user.username}'s account?`
      );
      if (confirmed) {
        this.userService.lockUser(user.user_id).subscribe({
          next: () => {
            alert(`User ${user.username} locked successfully`);
            this.fetchAllUsers();
          },
          error: () => {
            alert(`Failed to lock user ${user.username}`);
          },
        });
      }
    }
  }
}
