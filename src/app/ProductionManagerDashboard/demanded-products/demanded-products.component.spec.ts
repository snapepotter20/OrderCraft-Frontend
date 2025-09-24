import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandedProductsComponent } from './demanded-products.component';

describe('DemandedProductsComponent', () => {
  let component: DemandedProductsComponent;
  let fixture: ComponentFixture<DemandedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandedProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
