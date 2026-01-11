import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryInventoryComponent } from './query-inventory.component';

describe('QueryInventoryComponent', () => {
  let component: QueryInventoryComponent;
  let fixture: ComponentFixture<QueryInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
