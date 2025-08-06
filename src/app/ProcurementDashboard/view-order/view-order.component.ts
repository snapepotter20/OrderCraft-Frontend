// import { CommonModule, DatePipe } from '@angular/common';
// import { Component } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { ProcurementService } from '../../services/procurement.service';
// import { debounceTime, distinctUntilChanged } from 'rxjs';

// @Component({
//   selector: 'app-view-order',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
//   providers: [DatePipe],
//   templateUrl: './view-order.component.html',
//   styleUrl: './view-order.component.css',
// })
// export class ViewOrderComponent {
//   orders: any[] = [];
//   orderDetails: any;
//   filterForm!: FormGroup;
//   isSortedDesc = true; // default: sort by recent
//   orderId: number = 0;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private route: ActivatedRoute,
//     private procurementService: ProcurementService,
//     private datePipe: DatePipe
//   ) {}

//   ngOnInit(): void {
//     this.orderId = Number(this.route.snapshot.paramMap.get('id'));
//     this.filterForm = this.fb.group({
//       status: [''],
//       date: [''],
//     });

//     this.fetchOrders();

//     // this.procurementService.getOrderById(this.orderId).subscribe({
//     //   next: (res: any) => {
//     //     this.orderDetails = res;
//     //   },
//     //   error: () => alert('Failed to fetch order details'),
//     // });

//     this.filterForm.valueChanges
//       .pipe(debounceTime(400), distinctUntilChanged())
//       .subscribe(() => this.fetchOrders());
//   }

//   fetchOrders(): void {
//     const { status, date } = this.filterForm.value;
//     let formattedDate = '';
//     if (date) {
//       formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
//     }

//     this.procurementService.getFilteredOrders(status, formattedDate).subscribe({
//       next: (data) => {
//         this.orders = [...data]; // clone array
//         this.sortOrders(); // apply sorting
//       },
//       error: (err) => console.error('Error fetching orders:', err),
//     });
//   }

//   toggleSort(): void {
//     this.isSortedDesc = !this.isSortedDesc;
//     this.sortOrders();
//   }

//   sortOrders(): void {
//     this.orders.sort((a, b) => {
//       const dateA = new Date(a.orderDate).getTime();
//       const dateB = new Date(b.orderDate).getTime();
//       return this.isSortedDesc ? dateB - dateA : dateA - dateB;
//     });
//   }

//   downloadInvoicePdf(orderId: number): void {
//     if (!orderId) return;

//     this.procurementService.downloadInvoice(orderId).subscribe({
//       next: (fileData) => {
//         const blob = new Blob([fileData], { type: 'application/pdf' });
//         const url = window.URL.createObjectURL(blob);

//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `invoice_order_${orderId}.pdf`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       },
//       error: () => alert('❌ Failed to download invoice'),
//     });
//   }

//   deleteOrder(orderId: number): void {
//   if (!orderId) return;

//   // You can add a confirmation dialog here
//   if (!confirm('Are you sure you want to delete this order?')) {
//     return;
//   }

//   this.procurementService.deleteOrder(orderId).subscribe({
//     next: () => {
//       // Remove the deleted order from the list in UI
//       this.orders = this.orders.filter(o => o.purchaseOrderId !== orderId);
//       // Optionally show success message
//       alert('Order deleted successfully.');
//     },
//     error: () => {
//       alert('❌ Failed to delete order');
//     },
//   });
// }

// }

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProcurementService } from '../../services/procurement.service';
import { CommonModule, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.css',
})
export class ViewOrderComponent {
  orders: any[] = [];
  filterForm!: FormGroup;
  isSortedDesc = true;
  orderId: number = 0;
  products: any[] = [];
  rawMaterials: any[] = [];

  // Edit Modal controls
  editModalVisible = false;
  editingOrderId: number | null = null;
  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private procurementService: ProcurementService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.filterForm = this.fb.group({
      status: [''],
      date: [''],
    });

    this.fetchOrders();

    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.fetchOrders());
  }

  fetchOrders(): void {
    const { status, date } = this.filterForm.value;
    const formattedDate = date
      ? this.datePipe.transform(date, 'yyyy-MM-dd') || ''
      : '';

    this.procurementService.getFilteredOrders(status, formattedDate).subscribe({
      next: (data) => {
        this.orders = [...data]; // clone array
        this.sortOrders();
      },
      error: (err) => console.error('Error fetching orders:', err),
    });
  }

  toggleSort(): void {
    this.isSortedDesc = !this.isSortedDesc;
    this.sortOrders();
  }

  sortOrders(): void {
    this.orders.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return this.isSortedDesc ? dateB - dateA : dateA - dateB;
    });
  }

  onCancelOrder(orderId: number): void {
    const confirmed = confirm('Are you sure you want to cancel this order?');
    if (confirmed) {
      this.procurementService.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Order cancelled successfully.');
          this.fetchOrders();
        },
        error: () => {
          alert('Failed to cancel order.');
        },
      });
    }
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

  deleteOrder(orderId: number): void {
    if (!orderId) return;

    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    this.procurementService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter((o) => o.purchaseOrderId !== orderId);
        alert('Order deleted successfully.');
      },
      error: () => alert('❌ Failed to delete order'),
    });
  }

  // =================
  // Edit Modal Logic
  // =================

  openEditModal(order: any) {
    this.editModalVisible = true;
    this.editingOrderId = order.purchaseOrderId;

    if (order.orderType === 'CUSTOMER') {
      this.products = order.products || [];
    } else if (order.orderType === 'SUPPLIER') {
      this.rawMaterials = order.rawMaterials || [];
    }

    const isCustomer = order.orderType === 'CUSTOMER';

    this.orderForm = this.fb.group({
      orderType: [order.ordertype],
      orderDate: [{ value: order.orderDate, disabled: true }],
      expectedDelivery: [order.expectedDelivery, Validators.required],
      supplierId: [order.supplier?.supplier_id || null, Validators.required],
      deliveryStatus: [order.deliveryStatus, Validators.required],
      // items: this.fb.array(
      //   order.items.map((item: any) =>
      //     this.fb.group({
      //       itemId: [item.itemId || null],
      //       productId: [
      //         {
      //           value: isCustomer
      //             ? item.product?.productId
      //             : item.rawMaterial?.rawMaterialId,
      //           disabled: true,
      //         },
      //         Validators.required,
      //       ],
      //       quantity: [item.quantity, [Validators.required, Validators.min(1)]],
      //       cost: [item.cost, [Validators.required, Validators.min(0)]],
      //     })
      //   )
      // ),
      items: this.fb.array(
        order.items.map((item: any) => {
          const productIdOrRawMaterialId =
            order.orderType === 'CUSTOMER'
              ? item.product?.productId
              : item.rawMaterial?.rawMaterialId;

          return this.fb.group({
            itemId: [item.itemId || null],
            productId: [productIdOrRawMaterialId, Validators.required], // unified field
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            cost: [item.cost, [Validators.required, Validators.min(0)]],
          });
        })
      ),
    });
  }

  closeEditModal() {
    this.editModalVisible = false;
    this.editingOrderId = null;
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    const isCustomer = this.orderForm.get('orderType')?.value === 'CUSTOMER';
    this.items.push(
      this.fb.group({
        productId: ['', [Validators.required, Validators.min(1)]], // same key used for both
        quantity: ['', [Validators.required, Validators.min(1)]],
        cost: ['', [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeItem(idx: number) {
    if (this.items.length > 1) {
      this.items.removeAt(idx);
    }
  }

  saveEditedOrder() {
    if (this.orderForm.invalid || !this.editingOrderId) return;

    const raw = this.orderForm.getRawValue();
    const isCustomer = raw.orderType === 'CUSTOMER';

    // Merge duplicate product/rawMaterial items
    const mergedItemsMap = new Map<number, any>();

    raw.items.forEach((item: any) => {
      const key = item.productId; // productId used for both
      if (mergedItemsMap.has(key)) {
        const existing = mergedItemsMap.get(key)!;
        existing.quantity += item.quantity;
        existing.cost += item.cost;
      } else {
        mergedItemsMap.set(key, {
          itemId: item.itemId || null,
          productId: item.productId,
          quantity: item.quantity,
          cost: item.cost,
        });
      }
    });

    const itemsPayload = Array.from(mergedItemsMap.values()).map((item) => ({
      itemId: item.itemId || null,
      quantity: item.quantity,
      cost: item.cost,
      ...(isCustomer
        ? { product: { productId: item.productId } }
        : { rawMaterial: { rawMaterialId: item.productId } }),
    }));

    const payload = {
      orderDate: raw.orderDate,
      expectedDelivery: raw.expectedDelivery,
      deliveryStatus: raw.deliveryStatus,
      supplier: { supplier_id: raw.supplierId },
      items: itemsPayload,
    };

    this.procurementService
      .updateOrder(this.editingOrderId, payload)
      .subscribe({
        next: () => {
          this.fetchOrders();
          this.closeEditModal();
          alert('✅ Order updated successfully!');
        },
        error: () => alert('❌ Failed to update order.'),
      });
  }

  isCustomerOrder(): boolean {
    return this.orderForm?.get('orderType')?.value === 'CUSTOMER';
  }

  downloadReport() {
    this.procurementService.downloadAllOrdersPdf().subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all-orders.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportToExcel() {
    const filtered = this.orders;

    let totalQuantity = 0;
    let totalCost = 0;

    const data = filtered.map((order: any) => {
      let orderTotal = 0;
      let orderQuantity = 0;

      order.items.forEach((item: any, i: any) => {
        orderQuantity += item.quantity;
        orderTotal += item.quantity * item.cost;
      });

      totalQuantity += orderQuantity;
      totalCost += orderTotal;

      return {
        'Order ID': order.purchaseOrderId,
        'Order Type':
          order.ordertype ??
          'Order created way before order type was introduced.',
        'Order Date': order.orderDate,
        Status: order.deliveryStatus,
        'Expected Delivery': order.expectedDelivery,
        'Supplier ID': order.supplier?.supplier_id || '—',
        Items: order.items
          .map((i: any) => {
            if (i.product) {
              return `${i.product.productName} (x${i.quantity})`;
            } else if (i.rawmaterial) {
              return `${i.rawmaterial.material_name} (x${i.quantity})`;
            } else {
              return `Unknown Item (x${i.quantity})`;
            }
          })
          .join(', '),
        'Order Total (₹)': orderTotal.toFixed(2),
      };
    });

    const headers = {
      'Order ID': '',
      'Order Type': '',
      'Order Date': '',
      Status: '',
      'Expected Delivery': '',
      'Supplier ID': '',
      Items: 'Total',
      'Order Total (₹)': totalCost.toFixed(2),
    };
    data.push(headers);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { Report: worksheet }, SheetNames: ['Report'] };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'purchase-orders-report.xlsx');
  }
}
