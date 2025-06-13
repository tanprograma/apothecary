import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUnitComponent } from './manage-unit.component';

describe('ManageUnitComponent', () => {
  let component: ManageUnitComponent;
  let fixture: ComponentFixture<ManageUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
