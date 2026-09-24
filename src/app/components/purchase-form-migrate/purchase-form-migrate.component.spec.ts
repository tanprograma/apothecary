import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFormMigrateComponent } from './purchase-form-migrate.component';

describe('PurchaseFormMigrateComponent', () => {
  let component: PurchaseFormMigrateComponent;
  let fixture: ComponentFixture<PurchaseFormMigrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseFormMigrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseFormMigrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
