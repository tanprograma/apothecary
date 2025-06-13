import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesStatisticsComponent } from './sales-statistics.component';

describe('SalesStatisticsComponent', () => {
  let component: SalesStatisticsComponent;
  let fixture: ComponentFixture<SalesStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
