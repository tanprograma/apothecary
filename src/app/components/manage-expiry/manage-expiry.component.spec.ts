import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExpiryComponent } from './manage-expiry.component';

describe('ManageExpiryComponent', () => {
  let component: ManageExpiryComponent;
  let fixture: ComponentFixture<ManageExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageExpiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
