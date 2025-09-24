import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSuppliersComponent } from './manage-suppliers.component';

describe('ManageSuppliersComponent', () => {
  let component: ManageSuppliersComponent;
  let fixture: ComponentFixture<ManageSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSuppliersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
