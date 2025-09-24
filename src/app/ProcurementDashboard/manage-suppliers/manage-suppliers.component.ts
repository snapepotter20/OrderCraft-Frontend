import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcurementService } from '../../services/procurement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-suppliers.component.html',
  styleUrls: ['./manage-suppliers.component.css'],
})
export class ManageSuppliersComponent implements OnInit {
  suppliers: any[] = [];
  loading = true;
  error: string | null = null;

  showForm = false;
  isEditMode = false;
  formSubmitted = false;

  newSupplier: any = this.getEmptySupplier();

  constructor(private procurementService: ProcurementService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  getEmptySupplier() {
    return {
      supplier_name: '',
      contact_name: '',
      contact_email: '',
      phone: '',
      rating: 0,
      address: {
        addressStreet: '',
        addressCity: '',
        addressState: '',
      },
    };
  }

  loadSuppliers() {
    this.procurementService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching suppliers', err);
        this.error = 'Failed to load suppliers.';
        this.loading = false;
        Swal.fire('Error', 'Failed to load suppliers.', 'error');
      },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm && !this.isEditMode) {
      this.newSupplier = this.getEmptySupplier();
    }
    if (!this.showForm) {
      this.isEditMode = false;
    }
  }

  editSupplier(supplier: any) {
    this.newSupplier = { ...supplier };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteSupplier(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.procurementService.deleteSupplier(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Supplier deleted successfully!', 'success');
            this.loadSuppliers();
          },
          error: (err: any) => {
            console.error('Error deleting supplier', err);
            Swal.fire('Error', 'Failed to delete supplier.', 'error');
          },
        });
      }
    });
  }

  // ✅ Email validation
  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // ✅ Phone validation (10 digits)
  isValidPhone(phone: string): boolean {
    return /^\d{10}$/.test(phone);
  }

  // ✅ Get field value
  private getFieldValue(field: string): any {
    switch (field) {
      case 'supplier_name':
        return this.newSupplier.supplier_name;
      case 'contact_name':
        return this.newSupplier.contact_name;
      case 'contact_email':
        return this.newSupplier.contact_email;
      case 'phone':
        return this.newSupplier.phone;
      case 'street':
        return this.newSupplier.address.addressStreet;
      case 'city':
        return this.newSupplier.address.addressCity;
      case 'state':
        return this.newSupplier.address.addressState;
      default:
        return '';
    }
  }

  // ✅ Dynamic input class
  getInputClass(field: string): string {
    if (!this.formSubmitted) {
      return 'p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none';
    }

    const value = this.getFieldValue(field);
    if (
      !value ||
      (field === 'contact_email' && !this.isValidEmail(value)) ||
      (field === 'phone' && !this.isValidPhone(value))
    ) {
      return 'p-3 border rounded-lg border-red-500 focus:ring-2 focus:ring-red-400 outline-none';
    }

    return 'p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none';
  }

  saveSupplier() {
    this.formSubmitted = true;

    // Frontend Validations
    if (
      !this.newSupplier.supplier_name ||
      !this.newSupplier.contact_name ||
      !this.newSupplier.contact_email ||
      !this.newSupplier.phone ||
      !this.newSupplier.address.addressStreet ||
      !this.newSupplier.address.addressCity ||
      !this.newSupplier.address.addressState
    ) {
      Swal.fire('Validation Error', 'All fields are required!', 'error');
      return;
    }

    if (!this.isValidEmail(this.newSupplier.contact_email)) {
      Swal.fire(
        'Validation Error',
        'Please enter a valid email address!',
        'error'
      );
      return;
    }

    if (!this.isValidPhone(this.newSupplier.phone)) {
      Swal.fire('Validation Error', 'Phone number must be 10 digits!', 'error');
      return;
    }

    // Update Supplier
    if (this.isEditMode && this.newSupplier.supplier_id) {
      this.procurementService
        .updateSupplier(this.newSupplier.supplier_id, this.newSupplier)
        .subscribe({
          next: () => {
            Swal.fire('Updated!', 'Supplier updated successfully!', 'success');
            this.resetForm();
            this.loadSuppliers();
          },
          error: (err) => {
            console.error('Error updating supplier', err);
            const errorMsg = err.error?.message || 'Failed to update supplier.';
            Swal.fire('Error', errorMsg, 'error');
          },
        });
    } else {
      // Create Supplier
      this.procurementService.createSupplier(this.newSupplier).subscribe({
        next: () => {
          Swal.fire('Created!', 'Supplier created successfully!', 'success');
          this.resetForm();
          this.loadSuppliers();
        },
        error: (err) => {
          console.error('Error creating supplier', err);

          Swal.fire(
            'Error',
            err.error?.message || 'Failed to create supplier.',
            'error'
          );
        },
      });
    }
  }

  resetForm() {
    this.newSupplier = this.getEmptySupplier();
    this.showForm = false;
    this.isEditMode = false;
    this.formSubmitted = false;
  }

  updateRating(supplier: any, newRating: number) {
    supplier.rating = newRating;
    this.procurementService
      .updateSupplier(supplier.supplier_id, supplier)
      .subscribe({
        next: () => {
          console.log(
            `Supplier ${supplier.supplier_name} rating updated to ${newRating}`
          );
        },
        error: (err) => {
          console.error('Error updating rating', err);
          Swal.fire('Error', 'Failed to update rating.', 'error');
        },
      });
  }

  onUploadContract(supplierId: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        this.procurementService.uploadContract(supplierId, formData).subscribe({
          next: () => {
            Swal.fire(
              'Uploaded!',
              'Contract uploaded successfully!',
              'success'
            );
            this.loadSuppliers(); // refresh supplier list
          },
          error: (err) => {
            console.error('Error uploading contract', err);
            Swal.fire(
              'Error',
              err.error?.message || 'Failed to upload contract.',
              'error'
            );
          },
        });
      }
    };
    input.click();
  }

  onDownloadContract(supplierId: number) {
    this.procurementService
      .downloadContract(supplierId)
      .subscribe((res: Blob) => {
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contract.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
