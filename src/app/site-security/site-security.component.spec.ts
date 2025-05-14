import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSecurityComponent } from './site-security.component';

describe('SiteSecurityComponent', () => {
  let component: SiteSecurityComponent;
  let fixture: ComponentFixture<SiteSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
