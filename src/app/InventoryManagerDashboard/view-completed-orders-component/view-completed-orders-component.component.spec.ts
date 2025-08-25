import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompletedOrdersComponentComponent } from './view-completed-orders-component.component';

describe('ViewCompletedOrdersComponentComponent', () => {
  let component: ViewCompletedOrdersComponentComponent;
  let fixture: ComponentFixture<ViewCompletedOrdersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCompletedOrdersComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCompletedOrdersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
