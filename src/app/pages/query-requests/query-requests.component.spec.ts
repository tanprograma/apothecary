import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryRequestsComponent } from './query-requests.component';

describe('QueryRequestsComponent', () => {
  let component: QueryRequestsComponent;
  let fixture: ComponentFixture<QueryRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
