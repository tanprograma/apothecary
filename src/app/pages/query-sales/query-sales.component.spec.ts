import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySalesComponent } from './query-sales.component';

describe('QuerySalesComponent', () => {
  let component: QuerySalesComponent;
  let fixture: ComponentFixture<QuerySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuerySalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuerySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
