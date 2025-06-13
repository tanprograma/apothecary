import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIssueComponent } from './request-issue.component';

describe('RequestIssueComponent', () => {
  let component: RequestIssueComponent;
  let fixture: ComponentFixture<RequestIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
