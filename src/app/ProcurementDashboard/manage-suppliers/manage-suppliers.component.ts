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
// export class ManageSuppliersComponent implements OnInit {
//   suppliers: any[] = [];
//   loading = true;
//   error: string | null = null;

//   showForm = false;
//   newSupplier: any = {
//     supplier_name: '',
//     contact_name: '',
//     contact_email: '',
//     phone: '',
//     rating: 0,
//     address: {
//       addressStreet: '',
//       addressCity: '',
//       addressState: '',
//     },
//   };

//   constructor(private procurementService: ProcurementService) {}

//   ngOnInit(): void {
//     this.loadSuppliers();
//   }

//   loadSuppliers() {
//     this.procurementService.getAllSuppliers().subscribe({
//       next: (data) => {
//         this.suppliers = data;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching suppliers', err);
//         this.error = 'Failed to load suppliers.';
//         this.loading = false;
//         Swal.fire('Error', 'Failed to load suppliers.', 'error');
//       },
//     });
//   }

//   toggleForm() {
//     this.showForm = !this.showForm;
//   }

//   editSupplier(supplier: any) {
//     this.newSupplier = { ...supplier }; // pre-fill form
//     this.showForm = true;
//   }

//   deleteSupplier(id: number) {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'This action cannot be undone!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.procurementService.deleteSupplier(id).subscribe({
//           next: () => {
//             Swal.fire('Deleted!', 'Supplier deleted successfully!', 'success');
//             this.loadSuppliers();
//           },
//           error: (err: any) => {
//             console.error('Error deleting supplier', err);
//             Swal.fire('Error', 'Failed to delete supplier.', 'error');
//           },
//         });
//       }
//     });
//   }

//   saveSupplier() {
//     if (this.newSupplier.supplier_id) {
//       // update supplier
//       this.procurementService
//         .updateSupplier(this.newSupplier.supplier_id, this.newSupplier)
//         .subscribe({
//           next: () => {
//             alert('Supplier updated successfully!');
//             this.resetForm();
//             this.loadSuppliers();
//           },
//           error: (err) => {
//             console.error('Error updating supplier', err);
//             alert('Failed to update supplier.');
//           },
//         });
//     } else {
//       // create supplier
//       this.procurementService.createSupplier(this.newSupplier).subscribe({
//         next: () => {
//           alert('Supplier created successfully!');
//           this.resetForm();
//           this.loadSuppliers();
//         },
//         error: (err) => {
//           console.error('Error creating supplier', err);
//           alert('Failed to create supplier.');
//         },
//       });
//     }
//   }

//   resetForm() {
//     this.newSupplier = {
//       supplier_name: '',
//       contact_name: '',
//       contact_email: '',
//       phone: '',
//       address: { addressStreet: '', addressCity: '', addressState: '' },
//     };
//     this.showForm = false;
//   }

//   updateRating(supplier: any, newRating: number) {
//     supplier.rating = newRating; // update instantly in UI

//     this.procurementService
//       .updateSupplier(supplier.supplier_id, supplier)
//       .subscribe({
//         next: () => {
//           console.log(
//             `Supplier ${supplier.supplier_name} rating updated to ${newRating}`
//           );
//         },
//         error: (err) => {
//           console.error('Error updating rating', err);
//           alert('Failed to update rating.');
//         },
//       });
//   }
// }


export class ManageSuppliersComponent implements OnInit {
  suppliers: any[] = [];
  loading = true;
  error: string | null = null;

  showForm = false;
  isEditMode = false;

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
      // reset form for fresh creation
      this.newSupplier = this.getEmptySupplier();
    }
    if (!this.showForm) {
      this.isEditMode = false;
    }
  }

  editSupplier(supplier: any) {
    this.newSupplier = { ...supplier }; // pre-fill form
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

  saveSupplier() {
    if (this.isEditMode && this.newSupplier.supplier_id) {
      // update supplier
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
            Swal.fire('Error', 'Failed to update supplier.', 'error');
          },
        });
    } else {
      // create supplier
      this.procurementService.createSupplier(this.newSupplier).subscribe({
        next: () => {
          Swal.fire('Created!', 'Supplier created successfully!', 'success');
          this.resetForm();
          this.loadSuppliers();
        },
        error: (err) => {
          console.error('Error creating supplier', err);
          Swal.fire('Error', 'Failed to create supplier.', 'error');
        },
      });
    }
  }

  resetForm() {
    this.newSupplier = this.getEmptySupplier();
    this.showForm = false;
    this.isEditMode = false;
  }

  updateRating(supplier: any, newRating: number) {
    supplier.rating = newRating; // update instantly in UI

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
}
