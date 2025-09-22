import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService, RawMaterial } from '../../services/product.service';

@Component({
  selector: 'app-view-raw-materials',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './view-raw-materials.component.html',
  styleUrls: ['./view-raw-materials.component.css'],
})
export class ViewRawMaterialsComponent implements OnInit {
  rawMaterials: RawMaterial[] = [];

  constructor(private rawMaterialService: ProductService) {}

  ngOnInit(): void {
    this.loadRawMaterials();
  }

  loadRawMaterials() {
    this.rawMaterialService.getAllRawMaterials().subscribe((data) => {
      this.rawMaterials = data;
    });
  }

  editRawMaterial(material: RawMaterial) {
    alert('Edit clicked for ' + material.material_name);
    // You can navigate to edit page or open a modal
  }

  deleteRawMaterial(id: number) {
    // if (confirm('Are you sure you want to delete this raw material?')) {
    //   this.rawMaterialService.deleteRawMaterial(id).subscribe(() => {
    //     this.rawMaterials = this.rawMaterials.filter(m => m.raw_material_id !== id);
    //   });
    // }
    alert('Delete clicked');
  }
}
