import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScienceLabThree } from './science-lab-three';

describe('ScienceLabThree', () => {
  let component: ScienceLabThree;
  let fixture: ComponentFixture<ScienceLabThree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScienceLabThree],
    }).compileComponents();

    fixture = TestBed.createComponent(ScienceLabThree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
