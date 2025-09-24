import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm!: FormGroup;
  isEditing = false;
  profileId!: number;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneno: [{ value: '', disabled: true }, Validators.required],
      role: [{ value: '', disabled: true }]
    });

    this.fetchProfile();
  }

  fetchProfile() {
    this.profileService.getProfile().subscribe({
      next: (data: any) => {
        this.profileId = data.user_id;

        this.profileForm.patchValue({
          username: data.username,
          email: data.email,
          phoneno: data.phoneno,
          role: data.role?.roleName || 'N/A'
        });

        console.log('Profile loaded:', data);
      },
      error: (err: any) => {
        console.error('Error loading profile:', err);
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    ['username', 'email', 'phoneno'].forEach((field) =>
      this.profileForm.get(field)?.[this.isEditing ? 'enable' : 'disable']()
    );
  }

  onSave() {
    if (this.profileForm.valid && this.profileId) {
      const updatedData = this.profileForm.getRawValue();
      this.profileService.updateProfile(this.profileId, updatedData).subscribe({
        next: () => {
          this.toggleEdit();
        },
        error: (err: any) => {
          console.error('Error updating profile:', err);
        }
      });
    }
  }
}
