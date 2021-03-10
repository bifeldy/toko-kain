import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisComponent } from './jenis.component';

describe('JenisComponent', () => {
  let component: JenisComponent;
  let fixture: ComponentFixture<JenisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JenisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
