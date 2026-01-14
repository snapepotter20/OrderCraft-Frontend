import { Component, OnInit } from '@angular/core';
import { ProcurementService } from '../../services/procurement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generate-contract',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './generate-contract.component.html',
  styleUrl: './generate-contract.component.css',
})
export class GenerateContractComponent implements OnInit {
  suppliers: any[] = [];
  selectedSupplierId: string = '';

  constructor(private procurementService: ProcurementService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.procurementService.getAllSuppliers().subscribe(
      (data) => {
        this.suppliers = data;
      },
      (error) => {
        console.error('Error fetching suppliers', error);
      }
    );
  }

  generateContract() {
    if (!this.selectedSupplierId) {
      alert('Please select a supplier');
      return;
    }

    this.procurementService
      .generateContract(+this.selectedSupplierId)
      .subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `contract_supplier_${this.selectedSupplierId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
        },
        (error) => {
          console.error('Error generating contract', error);
          alert('Failed to generate contract. Please try again.');
        }
      );
  }
}
