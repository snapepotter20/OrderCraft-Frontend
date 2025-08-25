import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionsComponent } from './inventory-transactions.component';

describe('InventoryTransactionsComponent', () => {
  let component: InventoryTransactionsComponent;
  let fixture: ComponentFixture<InventoryTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
