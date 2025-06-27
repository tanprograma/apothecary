import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleFormDateComponent } from './sale-form-date.component';

describe('SaleFormDateComponent', () => {
  let component: SaleFormDateComponent;
  let fixture: ComponentFixture<SaleFormDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleFormDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleFormDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
