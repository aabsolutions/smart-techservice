import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsFormComponent } from './parts-form.component';

describe('PartsFormComponent', () => {
  let component: PartsFormComponent;
  let fixture: ComponentFixture<PartsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
