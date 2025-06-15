import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryFormComponent } from './expiry-form.component';

describe('ExpiryFormComponent', () => {
  let component: ExpiryFormComponent;
  let fixture: ComponentFixture<ExpiryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
