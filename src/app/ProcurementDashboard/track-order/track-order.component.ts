import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProcurementService } from '../../services/procurement.service';

@Component({
  selector: 'app-track-order',
  standalone:true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css',
})
export class TrackOrderComponent {
  orderId: number = 0;
  orderDetails: any;
  trackingDetails: any;
  trackingStages = [
    'Ordered',
    'Dispatched',
    'Delivered'
  ];
  currentStepIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private procurementService: ProcurementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    this.procurementService.getOrderById(this.orderId).subscribe({
      next: (res: any) => {
        this.orderDetails = res;
        this.setTrackingStageFromStatus(res.deliveryStatus);
      },
      error: () => alert('Failed to fetch order details'),
    });

    this.procurementService
      .getDeliveryTrackingByOrderId(this.orderId)
      .subscribe({
        next: (res: any) => {
          this.trackingDetails = res;
          this.setTrackingStageFromStatus(res.status); // update stage based on tracking status
        },
        error: () => console.warn('No tracking data found'),
      });
  }

  setTrackingStageFromStatus(status: string) {
    const statusMap: { [key: string]: number } = {
      PENDING: 0, // corresponds to "Ordered"
      DISPATCHED: 1, // corresponds to "Dispatched"
      DELIVERED: 2, // corresponds to "Delivered"
    };

    this.currentStepIndex = statusMap[status.toUpperCase()] ?? 0;
  }

  goBack() {
    this.router.navigate(['/procurement-dashboard']);
  }

  downloadInvoicePdf(): void {
    if (!this.orderId) return;

    this.procurementService.downloadInvoice(this.orderId).subscribe({
      next: (fileData) => {
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice_order_${this.orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('❌ Failed to download invoice'),
    });
  }
}
