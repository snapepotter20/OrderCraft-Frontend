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

  products: { id: number; name: string; productUnitPrice: number }[] = [];
  rawMaterials: { id: number; name: string; price: number }[] = [];
  customers: { id: number; name: string }[] = [];
  suppliers: { id: number; name: string }[] = [];

  showPaymentModal = false;
  pendingPayload: any = null;
  totalAmount = 0;

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
    this.addItem();
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  isCustomerOrder(): boolean {
    return this.orderForm.get('orderType')?.value === 'CUSTOMER';
  }

  onOrderTypeChange(): void {
    const customerIdControl = this.orderForm.get('customerId');
    const supplierIdControl = this.orderForm.get('supplierId');

    if (this.isCustomerOrder()) {
      customerIdControl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      customerIdControl?.clearValidators();
    }

    // supplier always required
    supplierIdControl?.setValidators([Validators.required, Validators.min(1)]);

    customerIdControl?.updateValueAndValidity();
    supplierIdControl?.updateValueAndValidity();

    this.items.clear();
    this.addItem();
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      unitPrice: [0],
      productId: [null],
      rawMaterialId: [null],
    });
  }

  addItem(): void {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateTotalAmount();
    }
  }

  fetchDropdownData(): void {
    this.procurementService.getAllProducts().subscribe((data) => {
      this.products = data.map((p: any) => ({
        id: p.productId,
        name: p.productName,
        productUnitPrice: p.productUnitPrice || 0,
      }));
    });

    this.procurementService.getAllRawMaterials().subscribe((data) => {
      this.rawMaterials = data.map((r: any) => ({
        id: r.raw_material_id,
        name: r.material_name,
        price: r.price || 0,
      }));
    });

    this.procurementService.getAllCustomers().subscribe((data) => {
      this.customers = data.map((c: any) => ({
        id: c.cust_id,
        name: c.cust_name,
      }));
    });

    this.procurementService.getAllSuppliers().subscribe((data) => {
      this.suppliers = data.map((s: any) => ({
        id: s.supplier_id,
        name: s.supplier_name,
      }));
    });
  }

  // Called when product is selected
  onProductSelect(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    const productId = itemGroup.get('productId')?.value;

    const selectedProduct = this.products.find(p => p.id === productId);
    if (selectedProduct) {
      const unitPrice = selectedProduct.productUnitPrice || 0;
      itemGroup.get('unitPrice')?.setValue(unitPrice);
      const quantity = itemGroup.get('quantity')?.value || 1;
      itemGroup.get('cost')?.setValue(quantity * unitPrice);
    } else {
      itemGroup.get('unitPrice')?.setValue(0);
      itemGroup.get('cost')?.setValue(0);
    }
    this.calculateTotalAmount();
  }

  // Called when raw material is selected
  onRawMaterialSelect(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    const rawMaterialId = itemGroup.get('rawMaterialId')?.value;

    const selectedMaterial = this.rawMaterials.find(r => r.id === rawMaterialId);
    if (selectedMaterial) {
      const unitPrice = selectedMaterial.price || 0;
      itemGroup.get('unitPrice')?.setValue(unitPrice);
      const quantity = itemGroup.get('quantity')?.value || 1;
      itemGroup.get('cost')?.setValue(quantity * unitPrice);
    } else {
      itemGroup.get('unitPrice')?.setValue(0);
      itemGroup.get('cost')?.setValue(0);
    }
    this.calculateTotalAmount();
  }

  // Called when quantity changes
  onQuantityChange(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    const quantity = itemGroup.get('quantity')?.value || 1;
    const unitPrice = itemGroup.get('unitPrice')?.value || 0;
    itemGroup.get('cost')?.setValue(quantity * unitPrice);
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void {
    const items = this.orderForm.value.items || [];
    this.totalAmount = items.reduce((sum: number, item: any) => {
      const cost = Number(item.cost) || 0;
      return sum + cost;
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

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.calculateTotalAmount();

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
      items: itemsPayload,
      supplier: { supplier_id: formValue.supplierId },
    };

    if (isCustomer) {
      payload.customer = { cust_id: formValue.customerId };
    }

    this.pendingPayload = payload;
    this.showPaymentModal = true;
  }

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
