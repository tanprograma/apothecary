import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracerFormComponent } from './tracer-form.component';

describe('TracerFormComponent', () => {
  let component: TracerFormComponent;
  let fixture: ComponentFixture<TracerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
