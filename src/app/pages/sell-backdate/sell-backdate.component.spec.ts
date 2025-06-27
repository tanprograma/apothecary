import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellBackdateComponent } from './sell-backdate.component';

describe('SellBackdateComponent', () => {
  let component: SellBackdateComponent;
  let fixture: ComponentFixture<SellBackdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellBackdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellBackdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
