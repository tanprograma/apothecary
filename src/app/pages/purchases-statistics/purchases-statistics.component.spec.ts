import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesStatisticsComponent } from './purchases-statistics.component';

describe('PurchasesStatisticsComponent', () => {
  let component: PurchasesStatisticsComponent;
  let fixture: ComponentFixture<PurchasesStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasesStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
