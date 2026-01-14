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

  filteredSuppliers: any[] = [];

  filters = {
    supplier_name: '',
    contact_name: '',
    contact_email: '',
    phone: '',
    city: '',
    state: '',
    rating: '',
  };

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
        this.filteredSuppliers = data;
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
    this.newSupplier = JSON.parse(JSON.stringify(supplier)); // deep copy
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
          error: (err) => {
            console.error('Error deleting supplier', err);
            Swal.fire('Error', 'Failed to delete supplier.', 'error');
          },
        });
      }
    });
  }

  // Email validation
  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Phone validation
  isValidPhone(phone: string): boolean {
    return /^\d{10}$/.test(phone);
  }

  // Fully dynamic getFieldValue (supports nested fields)
  private getFieldValue(field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], this.newSupplier);
  }

  // Dynamic input class
  getInputClass(field: string): string {
    const base = 'p-3 border rounded-lg outline-none focus:ring-2 transition';

    if (!this.formSubmitted) return `${base} border-gray-300 focus:ring-blue-400`;

    const value = this.getFieldValue(field);

    const invalid =
      !value ||
      (field === 'contact_email' && !this.isValidEmail(value)) ||
      (field === 'phone' && !this.isValidPhone(value));

    if (invalid) {
      return `${base} border-red-500 focus:ring-red-400`;
    }

    return `${base} border-gray-300 focus:ring-blue-400`;
  }

  saveSupplier() {
    this.formSubmitted = true;

    // Required fields check
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
      Swal.fire('Validation Error', 'Invalid email!', 'error');
      return;
    }

    if (!this.isValidPhone(this.newSupplier.phone)) {
      Swal.fire('Validation Error', 'Phone must be 10 digits!', 'error');
      return;
    }

    // Update
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
            Swal.fire('Error', err.error?.message || 'Failed to update.', 'error');
          },
        });
    } else {
      // Create
      this.procurementService.createSupplier(this.newSupplier).subscribe({
        next: () => {
          Swal.fire('Created!', 'Supplier created successfully!', 'success');
          this.resetForm();
          this.loadSuppliers();
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'Failed to create.', 'error');
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
        error: () => Swal.fire('Error', 'Failed to update rating.', 'error'),
      });
  }

  onUploadContract(supplierId: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        this.procurementService.uploadContract(supplierId, formData).subscribe({
          next: () => {
            Swal.fire('Uploaded!', 'Contract uploaded successfully!', 'success');
            this.loadSuppliers();
          },
          error: (err) =>
            Swal.fire('Error', err.error?.message || 'Upload failed', 'error'),
        });
      }
    };

    input.click();
  }

  onDownloadContract(supplierId: number) {
    this.procurementService.downloadContract(supplierId).subscribe((res: Blob) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contract.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  applyFilters() {
    this.filteredSuppliers = this.suppliers.filter((s) => {
      return (
        (this.filters.supplier_name === '' ||
          s.supplier_name.toLowerCase().includes(this.filters.supplier_name.toLowerCase())) &&
        (this.filters.contact_name === '' ||
          s.contact_name.toLowerCase().includes(this.filters.contact_name.toLowerCase())) &&
        (this.filters.contact_email === '' ||
          s.contact_email.toLowerCase().includes(this.filters.contact_email.toLowerCase())) &&
        (this.filters.phone === '' || s.phone.includes(this.filters.phone)) &&
        (this.filters.city === '' ||
          s.address?.addressCity.toLowerCase().includes(this.filters.city.toLowerCase())) &&
        (this.filters.state === '' ||
          s.address?.addressState.toLowerCase().includes(this.filters.state.toLowerCase())) &&
        (this.filters.rating === '' || s.rating == this.filters.rating)
      );
    });
  }

  resetFilters() {
    this.filters = {
      supplier_name: '',
      contact_name: '',
      contact_email: '',
      phone: '',
      city: '',
      state: '',
      rating: '',
    };
    this.filteredSuppliers = this.suppliers;
  }
}
