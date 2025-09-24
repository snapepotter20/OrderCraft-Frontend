import { Component } from '@angular/core';
import { ProcurementService } from '../../services/procurement.service';
import { InventoryService } from '../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-completed-orders-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-completed-orders-component.component.html',
  styleUrl: './view-completed-orders-component.component.css',
})
export class ViewCompletedOrdersComponent {
  completedOrders: any[] = [];
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
        this.completedOrders = orders.filter(
          (order) =>
            order.ordertype === 'CUSTOMER' &&
            order.deliveryStatus === 'DELIVERED'
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

  downloadInvoicePdf(orderId: number): void {
    if (!orderId) return;

    this.procurementService.downloadInvoice(orderId).subscribe({
      next: (fileData) => {
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice_order_${orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('❌ Failed to download invoice for order ' + orderId),
    });
  }
}
