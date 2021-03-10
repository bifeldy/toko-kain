import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KainComponent } from './kain.component';

describe('KainComponent', () => {
  let component: KainComponent;
  let fixture: ComponentFixture<KainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
