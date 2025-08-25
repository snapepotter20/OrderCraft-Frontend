import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-view-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-stocks.component.html',
  styleUrls: ['./view-stocks.component.css'],
})
export class ViewStocksComponent {
  products: any[] = [];
  categories: any[] = [];

  // Filters
  filters = {
    productName: '',
    categoryId: '',
  };
  selectedCategory: string = '';
  searchName: string = '';

  // Modals
  isCreateModalOpen = false;
  isEditModalOpen = false;
  // Demand modal state
  isDemandModalOpen = false;
  demandProduct: any = null;
  demandQuantity: number | null = null;

  // Form models
  newProduct = {
    productName: '',
    productDescription: '',
    productUnitPrice: null,
    productQuantity: null,
    categoryId: null,
  };

  selectedProduct: any = {};

  colors: string[] = [
    '#FCE7F3',
    '#E0F2FE',
    '#DCFCE7',
    '#FEF9C3',
    '#EDE9FE',
    '#FFE4E6',
    '#F0FDF4',
    '#FAE8FF',
  ];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  getRandomColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => (this.products = res),
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  // Apply filters
  applyFilters() {
    this.productService
      .getAllProductsFiltered(this.searchName, this.selectedCategory)
      .subscribe({
        next: (res) => (this.products = res),
        error: (err) => console.error('Error applying filters:', err),
      });
  }

  // Clear all filters
  clearFilters() {
    this.searchName = '';
    this.selectedCategory = '';
    this.filters = {
      productName: '',
      categoryId: '',
    };
    this.loadProducts(); // reload all products
  }

  // CREATE PRODUCT
  openCreateProductModal() {
    this.isCreateModalOpen = true;
  }

  closeCreateProductModal() {
    this.isCreateModalOpen = false;
  }

  saveProduct(form: NgForm) {
    if (form.invalid) {
      this.toastr.warning(
        'Please fill all required fields.',
        'Validation Error'
      );
      return;
    }

    const payload = {
      productName: this.newProduct.productName,
      productDescription: this.newProduct.productDescription,
      productUnitPrice: this.newProduct.productUnitPrice,
      productQuantity: this.newProduct.productQuantity,
      category: { categoryId: this.newProduct.categoryId },
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.toastr.success('Product created successfully!', 'Success');
        this.closeCreateProductModal();
        this.loadProducts();
        this.resetNewProductForm();
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.toastr.error('Failed to create product.', 'Error');
      },
    });
  }

  resetNewProductForm() {
    this.newProduct = {
      productName: '',
      productDescription: '',
      productUnitPrice: null,
      productQuantity: null,
      categoryId: null,
    };
  }

  // EDIT PRODUCT
  openEditProductModal(product: any) {
    this.selectedProduct = {
      productId: product.productId,
      productName: product.productName,
      productDescription: product.productDescription,
      productUnitPrice: product.productUnitPrice,
      productQuantity: product.productQuantity,
      categoryId: product.category?.categoryId,
    };
    this.isEditModalOpen = true;
  }

  closeEditProductModal() {
    this.isEditModalOpen = false;
  }

  updateProduct(form: NgForm) {
    if (form.invalid) {
      this.toastr.warning(
        'Please fill all required fields.',
        'Validation Error'
      );
      return;
    }

    const payload = {
      productName: this.selectedProduct.productName,
      productDescription: this.selectedProduct.productDescription,
      productUnitPrice: this.selectedProduct.productUnitPrice,
      productQuantity: this.selectedProduct.productQuantity,
      category: { categoryId: this.selectedProduct.categoryId },
    };

    this.productService
      .updateProduct(this.selectedProduct.productId, payload)
      .subscribe({
        next: () => {
          this.toastr.success('Product updated successfully!', 'Updated');
          this.closeEditProductModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.toastr.error('Failed to update product.', 'Error');
        },
      });
  }

  // DELETE PRODUCT
  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.toastr.info('Product deleted successfully.', 'Deleted');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.toastr.error('Failed to delete product.', 'Error');
        },
      });
    }
  }

  openDemandModal(product: any) {
    this.demandProduct = product;
    this.demandQuantity = null;
    this.isDemandModalOpen = true;
  }

  closeDemandModal() {
    this.isDemandModalOpen = false;
    this.demandProduct = null;
    this.demandQuantity = null;
  }

  createDemand() {
    const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire(
            '⚠️ Error',
            'No user token found. Please log in again.',
            'error'
          );
          return;
        }
    
        // Decode the JWT to extract user info
        const decoded: any = jwtDecode(token);
        console.log('Decoded Token:', decoded);
    
        const user = { user_id: decoded.userId };
    if (
      !this.demandQuantity ||
      this.demandQuantity < 20 ||
      this.demandQuantity > 100
    ) {
      this.toastr.warning('Please enter a valid quantity.', 'Validation Error');
      alert('❌ Quantity must be between 20 and 100');
      return;
    }

    this.productService
      .updateDemandedQuantity(this.demandProduct.productId, this.demandQuantity,user)
      .subscribe({
        next: () => {
          alert('Demand created successfully!');
          this.toastr.success('Demand created successfully!', 'Success');
          this.closeDemandModal();
          this.loadProducts(); // reload to reflect updated demand
        },
        error: (err) => {
          console.error('Error creating demand:', err);
          this.toastr.error('Failed to create demand.', 'Error');
        },
      });
  }

   openAddCategoryModal() {
    Swal.fire({
      title: 'Add New Category',
      input: 'text',
      inputLabel: 'Category Name',
      inputPlaceholder: 'Enter category name',
      inputValidator: (value) => {
        if (!value) {
          return 'Category name is required!';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: '#2563eb', // Tailwind blue-600
      cancelButtonColor: '#9ca3af',  // Tailwind gray-400
      preConfirm: (categoryName) => {
        return this.productService.addCategory({ categoryName }).toPromise()
          .then((res) => {
            this.loadCategories(); // refresh list
            return res;
          })
          .catch((err) => {
            Swal.showValidationMessage(`Request failed: ${err.error?.message || err.message}`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Success!', 'Category has been added.', 'success');
      }
    });
  }
}
