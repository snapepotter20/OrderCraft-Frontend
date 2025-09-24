import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService, RawMaterial } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-raw-materials',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './view-raw-materials.component.html',
  styleUrls: ['./view-raw-materials.component.css'],
})
export class ViewRawMaterialsComponent implements OnInit {
  rawMaterials: RawMaterial[] = [];
  editingMaterial: RawMaterial | null = null; // material being edited
  isEditModalOpen: boolean = false; // modal visibility
  suppliers: { id: number; name: string }[] = [];

  constructor(
    private rawMaterialService: ProductService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadRawMaterials();
    this.loadSuppliers();
  }

  loadRawMaterials() {
    this.rawMaterialService.getAllRawMaterials().subscribe({
      next: (data) => {
        this.rawMaterials = data;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load raw materials!',
        });
      },
    });
  }

  // ✅ Open modal for editing
  editRawMaterial(material: RawMaterial) {
    this.editingMaterial = {
      ...material,
      supplier: material.supplier
        ? { ...material.supplier }
        : { supplier_id: 0, supplier_name: '' },
    };
    this.isEditModalOpen = true;
  }

  // ✅ Save edited raw material
  saveEdit() {
    if (this.editingMaterial) {
      // Find the selected supplier object
      const selectedSupplier = this.suppliers.find(
        (s) => s.id === this.editingMaterial!.supplier!.supplier_id
      );

      if (selectedSupplier) {
        this.editingMaterial.supplier = {
          supplier_id: selectedSupplier.id,
          supplier_name: selectedSupplier.name,
        };
      }

      this.rawMaterialService
        .updateRawMaterial(
          this.editingMaterial.raw_material_id,
          this.editingMaterial
        )
        .subscribe({
          next: (updated) => {
            const index = this.rawMaterials.findIndex(
              (m) => m.raw_material_id === updated.raw_material_id
            );
            if (index > -1) {
              this.rawMaterials[index] = updated;
            }
            this.closeEditModal();
            this.loadRawMaterials();
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: 'Raw material updated successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update raw material!',
            });
          },
        });
    }
  }

  // ✅ Close modal without saving
  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingMaterial = null;
  }

  // ✅ Delete raw material
  deleteRawMaterial(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the raw material!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rawMaterialService.deleteRawMaterial(id).subscribe({
          next: () => {
            this.rawMaterials = this.rawMaterials.filter(
              (m) => m.raw_material_id !== id
            );
            this.loadRawMaterials();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Raw material has been deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete raw material!',
            });
          },
        });
      }
    });
  }

  loadSuppliers() {
    this.productService.getSuppliers().subscribe({
      next: (res) => {
        // Map API keys to match your template
        this.suppliers = res.map((s: any) => ({
          id: s.supplier_id,
          name: s.supplier_name,
        }));
      },
      error: (err) => console.error('Error fetching suppliers:', err),
    });
  }
}
