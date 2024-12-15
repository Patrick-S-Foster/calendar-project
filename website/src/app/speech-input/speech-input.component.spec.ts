import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechInputComponent } from './speech-input.component';

describe('SpeechInputComponent', () => {
  let component: SpeechInputComponent;
  let fixture: ComponentFixture<SpeechInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeechInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeechInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
