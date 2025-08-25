// Add to imports
import { Component } from '@angular/core';
import { ProcurementService } from '../../services/procurement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-view-requested-orders-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-requested-orders-component.component.html',
  styleUrl: './view-requested-orders-component.component.css',
})
export class ViewRequestedOrdersComponent {
  requestedOrders: any[] = [];
  otpMap: { [orderId: number]: string } = {};
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private procurementService: ProcurementService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // this.procurementService.getFilteredOrders('', null).subscribe({
    this.procurementService.getAllOrders().subscribe({
      next: (orders) => {
        this.requestedOrders = orders.filter(
          (order) =>
            order.ordertype === 'CUSTOMER' &&
            (order.deliveryStatus === 'PENDING' ||
              order.deliveryStatus === 'DISPATCHED')
        );

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load requested orders.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  // deliverOrder(orderId: number) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to deliver this order?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#2563eb', // Tailwind blue-600
  //     cancelButtonColor: '#d1d5db',  // Tailwind gray-300
  //     confirmButtonText: 'Yes, deliver it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.inventoryService.deliverOrder(orderId).subscribe({
  //         next: () => {
  //           Swal.fire({
  //             title: '✅ Delivered!',
  //             text: 'Order has been delivered successfully.',
  //             icon: 'success',
  //             confirmButtonColor: '#16a34a', // Tailwind green-600
  //           });
  //           this.requestedOrders = this.requestedOrders.filter(
  //             (o) => o.purchaseOrderId !== orderId
  //           );
  //         },
  //         error: (err) => {
  //           Swal.fire({
  //             title: '⚠️ Stock Issue',
  //             text:
  //               err.error ||
  //               'Insufficient stock! Please demand from Production Manager.',
  //             icon: 'error',
  //             confirmButtonColor: '#dc2626', // Tailwind red-600
  //           });
  //         },
  //       });
  //     }
  //   });
  // }

  deliverOrder(orderId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire(
        '⚠️ Error',
        'No user token found. Please log in again.',
        'error'
      );
      return;
    }

    // Decode the JWT to extract user info
    const decoded: any = jwtDecode(token);
    console.log('Decoded Token:', decoded);

    const user = { user_id: decoded.userId };
    console.log('User id', user);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to deliver this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Yes, deliver it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventoryService.deliverOrder(orderId, user).subscribe({
          next: () => {
            Swal.fire(
              '✅ Delivered!',
              'Order delivered successfully.',
              'success'
            );
            this.requestedOrders = this.requestedOrders.filter(
              (o) => o.purchaseOrderId !== orderId
            );
          },
          error: (err) => {
            Swal.fire(
              '⚠️ Stock Issue',
              err.error || 'Insufficient stock.',
              'error'
            );
          },
        });
      }
    });
  }
}
