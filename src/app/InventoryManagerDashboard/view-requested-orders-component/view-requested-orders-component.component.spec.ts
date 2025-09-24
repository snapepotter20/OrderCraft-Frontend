import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestedOrdersComponentComponent } from './view-requested-orders-component.component';

describe('ViewRequestedOrdersComponentComponent', () => {
  let component: ViewRequestedOrdersComponentComponent;
  let fixture: ComponentFixture<ViewRequestedOrdersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRequestedOrdersComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRequestedOrdersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
