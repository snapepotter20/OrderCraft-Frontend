import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledProductsComponent } from './scheduled-products.component';

describe('ScheduledProductsComponent', () => {
  let component: ScheduledProductsComponent;
  let fixture: ComponentFixture<ScheduledProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduledProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
