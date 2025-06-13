import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuantityComponent } from './manage-quantity.component';

describe('ManageQuantityComponent', () => {
  let component: ManageQuantityComponent;
  let fixture: ComponentFixture<ManageQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
