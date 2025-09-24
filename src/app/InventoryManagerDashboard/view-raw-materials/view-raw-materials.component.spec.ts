import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRawMaterialsComponent } from './view-raw-materials.component';

describe('ViewRawMaterialsComponent', () => {
  let component: ViewRawMaterialsComponent;
  let fixture: ComponentFixture<ViewRawMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRawMaterialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRawMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
