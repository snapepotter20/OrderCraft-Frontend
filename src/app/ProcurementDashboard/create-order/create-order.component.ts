import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProcurementService } from '../../services/procurement.service';
import { DeliveryAfterOrderValidator } from './DeliveryAfterOrderValidator';
import { DummyPaymentComponent } from '../dummy-payment/dummy-payment.component';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    DummyPaymentComponent,
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css',
})
export class CreateOrderComponent {
  orderForm: FormGroup;

  products: { id: number; name: string }[] = [];
  rawMaterials: { id: number; name: string }[] = [];
  showPaymentModal = false; // To toggle modal visibility
  pendingPayload: any = null; // Temporarily holds order payload

  constructor(
    private fb: FormBuilder,
    private procurementService: ProcurementService
  ) {
    this.orderForm = this.fb.group(
      {
        orderType: ['', Validators.required],
        customerId: [''],
        supplierId: [null, [Validators.required, Validators.min(1)]],
        orderDate: ['', Validators.required],
        expectedDelivery: ['', Validators.required],
        deliveryStatus: ['PENDING', Validators.required],
        items: this.fb.array([]),
      },
      { validators: DeliveryAfterOrderValidator }
    );

    this.fetchDropdownData();
    this.addItem(); // Initialize with one item
  }

  // Getter for items FormArray
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  // Checks if orderType is CUSTOMER
  isCustomerOrder(): boolean {
    return this.orderForm.get('orderType')?.value === 'CUSTOMER';
  }

  // Handles orderType changes
  onOrderTypeChange(): void {
    const customerIdControl = this.orderForm.get('customerId');

    if (this.isCustomerOrder()) {
      customerIdControl?.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
    } else {
      customerIdControl?.clearValidators();
    }

    customerIdControl?.updateValueAndValidity();

    // Reset item list when order type changes
    this.items.clear();
    this.addItem();
  }

  // Creates a FormGroup for one item row
  createItemGroup(): FormGroup {
    const group = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      cost: [1, [Validators.required, Validators.min(0)]],
      productId: [null], // ✅ Add this
      rawMaterialId: [null],
    });

    // Add correct control based on orderType
    // if (this.isCustomerOrder()) {
    //   group.addControl('productId', this.fb.control('', Validators.required));
    // } else {
    //   group.addControl('rawMaterialId', this.fb.control('', Validators.required));
    // }

    return group;
  }

  // Adds a new item row
  addItem(): void {
    this.items.push(this.createItemGroup());
  }

  // Removes an item row
  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // Fetch dropdown data for products and raw materials
  fetchDropdownData(): void {
    this.procurementService.getAllProducts().subscribe((data) => {
      this.products = data.map((p: any) => ({
        id: p.productId,
        name: p.productName,
      }));
    });

    this.procurementService.getAllRawMaterials().subscribe((data) => {
      this.rawMaterials = data.map((r: any) => ({
        id: r.raw_material_id,
        name: r.material_name,
      }));
    });
  }

  totalAmount = 0;

  calculateTotalAmount(): void {
    const items = this.orderForm.value.items || [];
    this.totalAmount = items.reduce((sum: number, item: any) => {
      const cost = Number(item.cost) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + cost * quantity;
    }, 0);
  }

  handlePaymentSuccess(): void {
    this.showPaymentModal = false;

    if (!this.pendingPayload) return;

    this.procurementService.createOrder(this.pendingPayload).subscribe({
      next: () => {
        alert('✅ Order created successfully!');
        this.resetForm();
        this.pendingPayload = null;
      },
      error: () => {
        alert('❌ Error creating order');
        this.pendingPayload = null;
      },
    });
  }

  handlePaymentFailure(): void {
    this.showPaymentModal = false;
    alert('❌ Payment failed. Order not created.');
    this.pendingPayload = null;
  }

  // Handles order form submission
  submitOrder(): void {
     console.log('Submit clicked');
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    // Calculate amount from item cost before opening modal
    this.calculateTotalAmount();

    // Prepare payload and show modal
    const formValue = this.orderForm.value;
    const isCustomer = formValue.orderType === 'CUSTOMER';

    const itemsPayload = formValue.items.map((item: any) => {
      const payload: any = {
        quantity: item.quantity,
        cost: item.cost,
      };

      if (isCustomer && item.productId) {
        payload.product = { productId: item.productId };
      } else if (!isCustomer && item.rawMaterialId) {
        payload.rawmaterial = { raw_material_id: item.rawMaterialId };
      }

      return payload;
    });

    const payload: any = {
      ordertype: formValue.orderType,
      orderDate: formValue.orderDate,
      expectedDelivery: formValue.expectedDelivery,
      deliveryStatus: formValue.deliveryStatus,
      supplier: { supplier_id: formValue.supplierId },
      items: itemsPayload,
    };

    if (isCustomer) {
      payload.customer = { cust_id: formValue.customerId };
    }

    this.pendingPayload = payload;
    this.showPaymentModal = true;
  }

  // Resets the form after submission
  resetForm(): void {
    this.orderForm.reset({
      orderType: '',
      customerId: '',
      supplierId: null,
      orderDate: '',
      expectedDelivery: '',
      deliveryStatus: 'PENDING',
    });
    this.items.clear();
    this.addItem();
  }
}
