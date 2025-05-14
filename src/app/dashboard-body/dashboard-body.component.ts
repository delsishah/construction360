import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-body',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-body.component.html',
  styleUrl: './dashboard-body.component.css'
})
export class DashboardBodyComponent {
  // Modal display flag
  showNewProjectModal = false;
  
  // New project form model
  newProject = {
    name: '',
    startDate: '',
    endDate: '',
    budget: '',
    manager: ''
  };

  constructor(private router: Router) {}

  // Open new project modal
  openNewProjectModal() {
    this.resetNewProjectForm();
    this.showNewProjectModal = true;
  }

  // Close all modals
  closeModals() {
    this.showNewProjectModal = false;
  }

  // Reset new project form
  resetNewProjectForm() {
    this.newProject = {
      name: '',
      startDate: '',
      endDate: '',
      budget: '',
      manager: ''
    };
  }

  // Submit new project
  submitNewProject() {
    if (!this.newProject.name || !this.newProject.startDate || !this.newProject.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    // In a real app, you'd save the project to a database
    console.log('New project created:', this.newProject);
    
    // Close the modal
    this.closeModals();
  }

  // Navigate to projects page
  goToProjects() {
    this.router.navigate(['/projects-reports']);
  }
}
