import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementdashboardComponent } from './procurementdashboard.component';

describe('ProcurementdashboardComponent', () => {
  let component: ProcurementdashboardComponent;
  let fixture: ComponentFixture<ProcurementdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcurementdashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcurementdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
