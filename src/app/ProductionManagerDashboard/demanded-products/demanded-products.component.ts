import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, DemandedProduct } from '../../services/product.service';

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

  submitSchedule() {
    if (!this.selectedProduct) return;

    this.productService.scheduleProduction(this.selectedProduct.productId, this.schedule).subscribe({
      next: () => {
        this.loadDemandedProducts(); // reload from backend with updated status
        this.closeScheduleModal();
      },
      error: (err) => {
        console.error('Error scheduling production', err);
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
