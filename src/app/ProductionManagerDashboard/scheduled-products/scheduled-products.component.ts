// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ProductionSchedule, ProductionService } from '../../services/production.service';
// import { NgChartsModule } from 'ng2-charts';

// @Component({
//   selector: 'app-scheduled-products',
//   standalone: true,
//   imports: [CommonModule,NgChartsModule],
//   templateUrl: './scheduled-products.component.html',
//   styleUrls: ['./scheduled-products.component.css']
// })
// export class ScheduledProductsComponent implements OnInit {

//   scheduledProducts: ProductionSchedule[] = [];
//   loading = true;

//   constructor(private productionService: ProductionService) {}

//   ngOnInit(): void {
//     this.productionService.getScheduledProducts().subscribe({
//       next: (data) => {
//         this.scheduledProducts = data;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching scheduled products', err);
//         this.loading = false;
//       }
//     });
//   }

//   dispatch(id: number) {
//   this.productionService.dispatchProduct(id).subscribe({
//     next: (updated) => {
//       const idx = this.scheduledProducts.findIndex(p => p.psId === id);
//       if (idx > -1) this.scheduledProducts[idx] = updated;
//     },
//     error: (err) => console.error('Dispatch failed', err)
//   });
// }



// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionSchedule, ProductionService } from '../../services/production.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-scheduled-products',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './scheduled-products.component.html',
  styleUrls: ['./scheduled-products.component.css']
})
export class ScheduledProductsComponent implements OnInit {

  scheduledProducts: ProductionSchedule[] = [];
  loading = true;

  // ✅ Chart data
  statusChartData: ChartData<'doughnut'> = {
    labels: ['Scheduled', 'In Progress', 'Quality Check', 'Ready', 'Dispatched' , 'Delivered'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0], // initial values
        backgroundColor: [
          '#FACC15', // yellow
          '#3B82F6', // blue
          '#FF0000', // red
          '#FB923C', // orange
          '#9333EA',  // purple
          '#22C55E', // green
        ]
      }
    ]
  };

  statusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12 }
        }
      }
    }
  };

  constructor(private productionService: ProductionService) {}

  ngOnInit(): void {
    this.productionService.getScheduledProducts().subscribe({
      next: (data) => {
        this.scheduledProducts = data;
        this.updateChartData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching scheduled products', err);
        this.loading = false;
      }
    });
  }

  // ✅ Dispatch product
  dispatch(id: number) {
    this.productionService.dispatchProduct(id).subscribe({
      next: (updated) => {
        const idx = this.scheduledProducts.findIndex(p => p.psId === id);
        if (idx > -1) this.scheduledProducts[idx] = updated;
        this.updateChartData(); // update chart after dispatch
      },
      error: (err) => console.error('Dispatch failed', err)
    });
  }

  // ✅ Update chart counts dynamically
  private updateChartData() {
    const statusCounts = {
      SCHEDULED: 0,
      IN_PROGRESS: 0,
      QUALITY_CHECK: 0,
      READY: 0,
      DISPATCHED: 0,
      DELIVERED: 0,
    };

    this.scheduledProducts.forEach(sp => {
      if (statusCounts[sp.psStatus as keyof typeof statusCounts] !== undefined) {
        statusCounts[sp.psStatus as keyof typeof statusCounts]++;
      }
    });

    this.statusChartData = {
      ...this.statusChartData,
      datasets: [
        {
          ...this.statusChartData.datasets[0],
          data: [
            statusCounts.SCHEDULED,
            statusCounts.IN_PROGRESS,
            statusCounts.QUALITY_CHECK,
            statusCounts.READY,
            statusCounts.DISPATCHED,
            statusCounts.DELIVERED
          ]
        }
      ]
    };
  }

  exportXLS() {
  this.productionService.exportDeliveredXLS().subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'delivered_products.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => console.error('Export XLS failed', err)
  });
}

exportPDF() {
  this.productionService.exportDeliveredPDF().subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'delivered_products.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => console.error('Export PDF failed', err)
  });
}

}
