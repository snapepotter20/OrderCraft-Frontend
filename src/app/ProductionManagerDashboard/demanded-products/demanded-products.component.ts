import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, DemandedProduct } from '../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-demanded-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demanded-products.component.html',
  styleUrl: './demanded-products.component.css'
})
export class DemandedProductsComponent implements OnInit {

  demandedProducts: DemandedProduct[] = [];
  loading = true;

  showScheduleModal = false;
  selectedProduct: DemandedProduct | null = null;
  schedule = {
    psStartDate: '',
    psEndDate: '',
    psQuantity: 0
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadDemandedProducts();
  }

  loadDemandedProducts() {
    this.loading = true;
    this.productService.getDemandedProducts().subscribe({
      next: (data) => {
        this.demandedProducts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching demanded products', err);
        this.loading = false;
      }
    });
  }

  openScheduleModal(product: DemandedProduct) {
    this.selectedProduct = product;
    this.schedule = {
      psStartDate: '',
      psEndDate: '',
      psQuantity: product.demandedQuantity
    };
    this.showScheduleModal = true;
  }

  closeScheduleModal() {
    this.showScheduleModal = false;
    this.selectedProduct = null;
  }

  // submitSchedule() {
  //   if (!this.selectedProduct) return;

  //   this.productService.scheduleProduction(this.selectedProduct.productId, this.schedule).subscribe({
  //     next: () => {
  //       this.loadDemandedProducts(); // reload from backend with updated status
  //       this.closeScheduleModal();
  //     },
  //     error: (err) => {
  //       console.error('Error scheduling production', err);
  //     }
  //   });
  // }

submitSchedule() {
  if (!this.selectedProduct) return;
  const product = this.selectedProduct;

  Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to schedule production for ${product.productName}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, schedule it!'
  }).then((result: any) => {
    if (result.isConfirmed) {
      this.productService.scheduleProduction(product.productId, this.schedule).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Scheduled!',
            text: 'Production has been successfully scheduled.'
          });
          this.loadDemandedProducts();
          this.closeScheduleModal();
        },
        error: (err) => {
          console.error('Error scheduling production', err);

          // Extract backend message if available
          let errorMsg = 'Something went wrong while scheduling production!';
          if (err?.error?.message) {
            errorMsg = err.error.message; // Spring Boot sends {"message": "..."} by default
          } else if (err?.error) {
            errorMsg = err.error; // sometimes backend sends plain string
          }

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMsg
          });
        }
      });
    }
  });
}


  deliverProduct(product: DemandedProduct) {
    this.productService.deliverProduct(product.productId).subscribe({
      next: () => {
        this.loadDemandedProducts(); // refresh after delivery
      },
      error: (err) => {
        console.error('Error delivering product', err);
      }
    });
  }
}
