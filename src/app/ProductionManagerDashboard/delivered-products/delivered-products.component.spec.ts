import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredProductsComponent } from './delivered-products.component';

describe('DeliveredProductsComponent', () => {
  let component: DeliveredProductsComponent;
  let fixture: ComponentFixture<DeliveredProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveredProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveredProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
