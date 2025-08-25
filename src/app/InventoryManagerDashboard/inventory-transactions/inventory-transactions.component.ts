// // inventory-transactions.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { InventoryService, InventoryTransaction } from '../../services/inventory.service';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-inventory-transactions',
//   standalone: true,
//   imports: [CommonModule,FormsModule],
//   templateUrl: './inventory-transactions.component.html',
//   styleUrl: './inventory-transactions.component.css'
// })
// export class InventoryTransactionsComponent implements OnInit {
//   // transactions: InventoryTransaction[] = [];
//   // isLoading = true;

//   // constructor(private inventoryService: InventoryService) {}

//   // ngOnInit(): void {
//   //   this.inventoryService.getTransactions().subscribe({
//   //     next: (data) => {
//   //       this.transactions = data;
//   //       this.isLoading = false;
//   //     },
//   //     error: (err) => {
//   //       console.error('Error fetching transactions', err);
//   //       this.isLoading = false;
//   //     },
//   //   });
//   // }
//    transactions: InventoryTransaction[] = [];
//   isLoading = true;

//   filters = {
//     productName: '',
//     transactionType: '',
//     startDate: '',
//     endDate: '',
//     performedBy: ''
//   };

//   constructor(private inventoryService: InventoryService) {}

//   ngOnInit(): void {
//     this.fetchTransactions();
//   }

//   fetchTransactions() {
//     this.isLoading = true;
//     this.inventoryService.getTransactions(this.filters).subscribe({
//       next: (data) => {
//         this.transactions = data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching transactions', err);
//         this.isLoading = false;
//       },
//     });
//   }

//   applyFilters() {
//     this.fetchTransactions();
//   }

//   clearFilters() {
//     this.filters = {
//       productName: '',
//       transactionType: '',
//       startDate: '',
//       endDate: '',
//       performedBy: ''
//     };
//     this.fetchTransactions();
//   }
// }

// inventory-transactions.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InventoryService,
  InventoryTransaction,
} from '../../services/inventory.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-inventory-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-transactions.component.html',
  styleUrl: './inventory-transactions.component.css',
})
export class InventoryTransactionsComponent implements OnInit {
  transactions: InventoryTransaction[] = [];
  isLoading = true;

  filtersForm!: FormGroup;

  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      productName: [''],
      transactionType: [''],
      startDate: [''],
      endDate: [''],
      performedBy: [''],
    });

    // 👇 listen for changes, debounce, and apply filters
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(500), // wait 500ms after user stops typing
        distinctUntilChanged() // only if form values actually changed
      )
      .subscribe((values) => {
        this.fetchTransactions(values);
      });

    // initial load
    this.fetchTransactions(this.filtersForm.value);
  }

  fetchTransactions(filters: any) {
    this.isLoading = true;
    this.inventoryService.getTransactions(filters).subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching transactions', err);
        this.isLoading = false;
      },
    });
  }

  clearFilters() {
    this.filtersForm.reset({
      productName: '',
      transactionType: '',
      startDate: '',
      endDate: '',
      performedBy: '',
    });
  }

   exportPdf() {
    const filters = this.filtersForm.value;
    this.inventoryService.exportPdf(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_transactions.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error exporting PDF', err);
      },
    });
  }

  exportExcel() {
    const filters = this.filtersForm.value;
    this.inventoryService.exportExcel(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_transactions.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error exporting Excel', err);
      },
    });
  }

  // inventory-transactions.component.ts
selectedTransaction: InventoryTransaction | null = null;
showModal = false;

openModal(tx: InventoryTransaction) {
  this.selectedTransaction = tx;
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
  this.selectedTransaction = null;
}


}
