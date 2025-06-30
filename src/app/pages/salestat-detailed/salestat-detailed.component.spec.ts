import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalestatDetailedComponent } from './salestat-detailed.component';

describe('SalestatDetailedComponent', () => {
  let component: SalestatDetailedComponent;
  let fixture: ComponentFixture<SalestatDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalestatDetailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalestatDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
