import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipeComponent } from './tipe.component';

describe('TipeComponent', () => {
  let component: TipeComponent;
  let fixture: ComponentFixture<TipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
