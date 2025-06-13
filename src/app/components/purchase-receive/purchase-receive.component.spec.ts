import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReceiveComponent } from './purchase-receive.component';

describe('PurchaseReceiveComponent', () => {
  let component: PurchaseReceiveComponent;
  let fixture: ComponentFixture<PurchaseReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseReceiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
