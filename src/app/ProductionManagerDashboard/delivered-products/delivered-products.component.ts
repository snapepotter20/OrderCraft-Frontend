import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveredProduct, ProductionService } from '../../services/production.service';

@Component({
  selector: 'app-delivered-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivered-products.component.html',
  styleUrls: ['./delivered-products.component.css']
})
export class DeliveredProductsComponent implements OnInit {
  deliveredProducts: DeliveredProduct[] = [];
  loading = true;
  error: string | null = null;

  constructor(private deliveredProductsService: ProductionService) {}

  ngOnInit(): void {
    this.fetchDeliveredProducts();
  }

  fetchDeliveredProducts(): void {
    this.deliveredProductsService.getDeliveredProducts().subscribe({
      next: (data) => {
        this.deliveredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load delivered products.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
