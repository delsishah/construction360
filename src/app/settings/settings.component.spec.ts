import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      schemas: [NO_ERRORS_SCHEMA] // Ignores external templates like router-outlet
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dark mode', () => {
    const initialMode = component.isDarkMode;
    component.toggleDarkMode();
    expect(component.isDarkMode).toBe(!initialMode);
  });

  it('should set active tab to general', () => {
    component.setActiveTab('general');
    expect(component.activeTab).toBe('general');
  });

  it('should set active tab to camera', () => {
    component.setActiveTab('camera');
    expect(component.activeTab).toBe('camera');
  });

  it('should have predefined camera list', () => {
    expect(component.cameras.length).toBeGreaterThan(0);
    expect(component.cameras[0].name).toBe('Camera 1');
  });
});
