import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-order-return-modal',
  standalone: true,
  templateUrl: './order-return-modal.component.html',
  styleUrl: './order-return-modal.component.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class OrderReturnModalComponent implements OnInit {
  @Input() order: any = null; // Order to return items from
  @Input() open = false; // Controls modal visibility
  @Output() closed = new EventEmitter(); // Parent can react to close
  @Output() submitted = new EventEmitter<any>(); // Return order payload for parent

  returnForm!: FormGroup;
  userId!: number;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.order) this.buildForm();
    const token = localStorage.getItem('token');
    if (token) {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      this.userId = payloadDecoded.userId;
      console.log(this.userId);
    }
  }

  ngOnChanges() {
    if (this.order) this.buildForm();
  }

  buildForm() {
    const controls: any = { reason: ['', Validators.required] };
    this.order.items.forEach((_item: any, i: number) => {
      controls[`return_${i}_checked`] = [false];
      controls[`return_${i}_qty`] = [
        { value: 1, disabled: true },
        [Validators.min(1), Validators.max(this.order.items[i].quantity)],
      ];
    });
    this.returnForm = this.fb.group(controls);

    this.order.items.forEach((_: any, i: number) => {
      this.returnForm
        .get(`return_${i}_checked`)
        ?.valueChanges.subscribe((checked) => {
          if (checked) this.returnForm.get(`return_${i}_qty`)?.enable();
          else {
            this.returnForm.get(`return_${i}_qty`)?.disable();
            this.returnForm.get(`return_${i}_qty`)?.setValue(1);
          }
        });
    });
  }

  hasReturnItems() {
    return Object.keys(this.returnForm.controls).some(
      (k) => k.endsWith('_checked') && this.returnForm.get(k)?.value
    );
  }

  handleSubmit() {
    if (this.returnForm.invalid) return;
    const items: any[] = [];
    for (let i = 0; i < this.order.items.length; i++) {
      if (this.returnForm.get(`return_${i}_checked`)?.value) {
        const quantity = this.returnForm.get(`return_${i}_qty`)?.value;
        if (quantity > 0 && quantity <= this.order.items[i].quantity) {
          items.push({
            product: { productId: this.order.items[i].product.productId },
            returnQuantity: quantity,
            conditionNote:
              this.returnForm.value.conditionNote?.trim() ||
              'No condition note provided',
          });
        }
      }
    }
    const now = new Date();
    const rdate = now.toISOString().split('.')[0] + 'Z';
    if (!items.length) return;
    this.submitted.emit({
      rdate,
      rreason: this.returnForm.value.reason,
      rstatus: 'PENDING',
      purchaseOrder: { purchaseOrderId: this.order.purchaseOrderId },
      returnedBy: { user_id: this.userId },
      items,
    });
  }

  handleClose() {
    this.closed.emit();
  }
}
