import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcurementService } from '../../services/procurement.service';

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
  newSupplier: any = {
    supplier_name: '',
    contact_name: '',
    contact_email: '',
    phone: '',
    address: {
      addressStreet: '',
      addressCity: '',
      addressState: '',
    },
  };

  constructor(private procurementService: ProcurementService) {}

  ngOnInit(): void {
    this.loadSuppliers();
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
      },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  editSupplier(supplier: any) {
    this.newSupplier = { ...supplier }; // pre-fill form
    this.showForm = true;
  }

  deleteSupplier(id: number) {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.procurementService.deleteSupplier(id).subscribe({
        next: () => {
          alert('Supplier deleted successfully!');
          this.loadSuppliers();
        },
        error: (err: any) => {
          console.error('Error deleting supplier', err);
          alert('Failed to delete supplier.');
        },
      });
    }
  }

  saveSupplier() {
    if (this.newSupplier.supplier_id) {
      // Update existing
      this.procurementService
        .updateSupplier(this.newSupplier.supplier_id, this.newSupplier)
        .subscribe({
          next: () => {
            alert('Supplier updated successfully!');
            this.resetForm();
            this.loadSuppliers();
          },
          error: (err) => {
            console.error('Error updating supplier', err);
            alert('Failed to update supplier.');
          },
        });
    } else {
      // Create new
      this.procurementService.createSupplier(this.newSupplier).subscribe({
        next: () => {
          alert('Supplier created successfully!');
          this.resetForm();
          this.loadSuppliers();
        },
        error: (err) => {
          console.error('Error creating supplier', err);
          alert('Failed to create supplier.');
        },
      });
    }
  }

  resetForm() {
    this.newSupplier = {
      supplier_name: '',
      contact_name: '',
      contact_email: '',
      phone: '',
      address: { addressStreet: '', addressCity: '', addressState: '' },
    };
    this.showForm = false;
  }
}
