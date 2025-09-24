import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReturnModalComponent } from './order-return-modal.component';

describe('OrderReturnModalComponent', () => {
  let component: OrderReturnModalComponent;
  let fixture: ComponentFixture<OrderReturnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderReturnModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderReturnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
