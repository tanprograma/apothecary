import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsFilterComponent } from './statistics-filter.component';

describe('StatisticsFilterComponent', () => {
  let component: StatisticsFilterComponent;
  let fixture: ComponentFixture<StatisticsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
