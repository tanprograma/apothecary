import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracerManageComponent } from './tracer-manage.component';

describe('TracerManageComponent', () => {
  let component: TracerManageComponent;
  let fixture: ComponentFixture<TracerManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracerManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracerManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
