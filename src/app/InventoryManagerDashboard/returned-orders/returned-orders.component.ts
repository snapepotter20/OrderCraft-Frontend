import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-returned-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './returned-orders.component.html',
  styleUrls: ['./returned-orders.component.css'],
})
export class ReturnedOrdersComponent implements OnInit {
  returnedOrders: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadReturnedOrders();
  }

  filters: any = {
    returnId: null,
    rdate: null,
    purchaseOrderId: null,
  };

  applyFilters() {
    this.loading = true;
    this.inventoryService.getFilteredReturnOrders(this.filters).subscribe({
      next: (data: any) => {
        this.returnedOrders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to filter returned orders.';
        this.loading = false;
      },
    });
  }

  resetFilters() {
    this.filters = { returnId: null, rdate: null, purchaseOrderId: null };
    this.loadReturnedOrders();
  }

  loadReturnedOrders() {
    this.inventoryService.getAllReturnOrders().subscribe({
      next: (data: any) => {
        this.returnedOrders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load returned orders.';
        this.loading = false;
      },
    });
  }

  approveOrder(orderId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this order return?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventoryService.approveReturnOrder(orderId).subscribe({
          next: () => {
            // Update UI locally
            const order = this.returnedOrders.find((o) => o.rid === orderId);
            if (order) {
              order.rstatus = 'APPROVED';
            }

            // Success popup
            Swal.fire(
              'Approved!',
              'The order return has been approved.',
              'success'
            );
          },
          error: (err) => {
            console.error('Approval failed', err);

            Swal.fire(
              'Error!',
              'Failed to approve the order return. Please try again.',
              'error'
            );
          },
        });
      }
    });
  }
}
