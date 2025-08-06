import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dummy-payment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './dummy-payment.component.html',
  styleUrl: './dummy-payment.component.css'
})
export class DummyPaymentComponent {
  
  @Input() amount: number = 0;
  @Output() paymentSuccess = new EventEmitter<void>();
  @Output() paymentFailure = new EventEmitter<void>();

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  submitPayment(): void {
    if (this.paymentForm.valid) {
      setTimeout(() => {
        alert('💳 Dummy payment successful!');
        this.paymentSuccess.emit();
      }, 1000);
    } else {
      alert('❌ Invalid payment details.');
    }
  }

  cancelPayment(): void {
    this.paymentFailure.emit();
  }
}
