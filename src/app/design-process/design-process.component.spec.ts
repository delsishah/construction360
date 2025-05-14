import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignProcessComponent } from './design-process.component';

describe('DesignProcessComponent', () => {
  let component: DesignProcessComponent;
  let fixture: ComponentFixture<DesignProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
