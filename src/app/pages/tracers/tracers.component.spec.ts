import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracersComponent } from './tracers.component';

describe('TracersComponent', () => {
  let component: TracersComponent;
  let fixture: ComponentFixture<TracersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
