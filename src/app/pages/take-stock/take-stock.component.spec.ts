import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeStockComponent } from './take-stock.component';

describe('TakeStockComponent', () => {
  let component: TakeStockComponent;
  let fixture: ComponentFixture<TakeStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
