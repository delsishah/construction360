import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  isDarkMode = false;
  activeTab: 'general' | 'camera' = 'general';

  cameras = [
    { name: 'Camera 1', status: 'Active' },
    { name: 'Camera 2', status: 'Inactive' }
  ];

  constructor() {
    // Load saved preferences
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) this.isDarkMode = JSON.parse(savedTheme);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  setActiveTab(tab: 'general' | 'camera') {
    this.activeTab = tab;
  }
}
