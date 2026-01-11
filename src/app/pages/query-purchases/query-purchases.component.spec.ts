import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryPurchasesComponent } from './query-purchases.component';

describe('QueryPurchasesComponent', () => {
  let component: QueryPurchasesComponent;
  let fixture: ComponentFixture<QueryPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryPurchasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
