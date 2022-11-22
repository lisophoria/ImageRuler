import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOverlayComponent } from './app-overlay.component';

describe('AppOverlayComponent', () => {
  let component: AppOverlayComponent;
  let fixture: ComponentFixture<AppOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
