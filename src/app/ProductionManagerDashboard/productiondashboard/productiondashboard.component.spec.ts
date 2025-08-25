import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductiondashboardComponent } from './productiondashboard.component';

describe('ProductiondashboardComponent', () => {
  let component: ProductiondashboardComponent;
  let fixture: ComponentFixture<ProductiondashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductiondashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductiondashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
