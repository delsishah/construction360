import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Auth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from '@angular/fire/auth';

interface UserSettings {
  displayName: string;
  emailNotifications: boolean;
  fontSize: string;
  twoFactorAuth: boolean;
  darkMode: boolean;
  theme: string;
  language: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // User settings model
  userSettings: UserSettings = {
    displayName: 'Project Manager',
    emailNotifications: true,
    fontSize: 'Medium',
    twoFactorAuth: false,
    darkMode: false,
    theme: 'Default',
    language: 'English'
  };

  // Password change form
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Modal display flags
  showPasswordModal = false;
  showSavedNotification = false;
  
  // Theme options
  themeOptions = ['Default', 'Light', 'Dark', 'Blue'];
  fontSizeOptions = ['Small', 'Medium', 'Large'];
  languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese'];
  
  constructor(private auth: Auth, private authService: AuthService) {
    this.loadSettings();
  }

  ngOnInit(): void {
    this.applySettings();
  }

  // Load saved settings
  loadSettings(): void {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      this.userSettings = {...this.userSettings, ...JSON.parse(savedSettings)};
    }
  }

  // Save settings to local storage
  saveSettings(): void {
    localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
    this.applySettings();
    this.showSavedNotification = true;
    
    setTimeout(() => {
      this.showSavedNotification = false;
    }, 3000);
  }

  // Apply settings to the application
  applySettings(): void {
    // Apply font size
    document.documentElement.style.fontSize = 
      this.userSettings.fontSize === 'Small' ? '14px' : 
      this.userSettings.fontSize === 'Large' ? '18px' : '16px';
    
    // Apply dark mode
    document.body.classList.toggle('dark-mode', this.userSettings.darkMode);
    
    // Apply theme
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${this.userSettings.theme.toLowerCase()}`);
  }

  // Toggle dark mode
  toggleDarkMode(): void {
    this.userSettings.darkMode = !this.userSettings.darkMode;
    this.applySettings();
  }

  // Toggle email notifications
  toggleEmailNotifications(): void {
    this.userSettings.emailNotifications = !this.userSettings.emailNotifications;
  }

  // Toggle two-factor authentication
  toggleTwoFactorAuth(): void {
    this.userSettings.twoFactorAuth = !this.userSettings.twoFactorAuth;
  }

  // Open change password modal
  openChangePasswordModal(): void {
    this.resetPasswordForm();
    this.showPasswordModal = true;
  }

  // Close modals
  closeModals(): void {
    this.showPasswordModal = false;
  }

  // Reset password form
  resetPasswordForm(): void {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  // Submit password change
  submitPasswordChange(): void {
    // Validation
    if (!this.passwordForm.currentPassword) {
      alert('Please enter your current password');
      return;
    }
    
    if (!this.passwordForm.newPassword) {
      alert('Please enter a new password');
      return;
    }
    
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    if (this.passwordForm.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }
    
    const user = this.auth.currentUser;
    
    if (!user || !user.email) {
      alert('No user is currently logged in');
      return;
    }
    
    // Re-authenticate the user before changing password
    const credential = EmailAuthProvider.credential(
      user.email,
      this.passwordForm.currentPassword
    );
    
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // User re-authenticated, now change password
        return updatePassword(user, this.passwordForm.newPassword);
      })
      .then(() => {
        alert('Password changed successfully!');
        this.closeModals();
      })
      .catch((error) => {
        console.error('Error changing password:', error);
        if (error.code === 'auth/wrong-password') {
          alert('Current password is incorrect');
        } else {
          alert('Error changing password: ' + error.message);
        }
      });
  }
}
