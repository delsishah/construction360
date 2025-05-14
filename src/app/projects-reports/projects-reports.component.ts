import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-reports.component.html',
  styleUrl: './projects-reports.component.css'
})
export class ProjectsReportsComponent {
  // Modal display flags
  showNewProjectModal = false;
  showViewProjectModal = false;
  showEditProjectModal = false;
  showDeleteConfirmModal = false;
  showNewReportModal = false;
  
  // Search term
  projectSearchTerm = '';
  reportFilterType = 'All';
  
  // View expanded reports
  showAllReports = false;
  maxDisplayedReports = 4;

  // New project and report form models
  newProject = {
    name: '',
    startDate: '',
    endDate: '',
    budget: '',
    manager: ''
  };

  // Selected project for view/edit/delete
  selectedProject: any = null;

  newReport = {
    title: '',
    type: 'Financial',
    author: ''
  };

  // Sample data for projects
  projects = [
    {
      id: 1,
      name: 'West Side Tower',
      progress: 75,
      status: 'On Track',
      startDate: '2023-04-15',
      endDate: '2024-12-30',
      budget: '$12.5M',
      manager: 'John Smith'
    },
    {
      id: 2,
      name: 'Riverside Complex',
      progress: 32,
      status: 'Delayed',
      startDate: '2023-06-20',
      endDate: '2025-02-15',
      budget: '$8.7M',
      manager: 'Lisa Johnson'
    },
    {
      id: 3,
      name: 'Metro Business Center',
      progress: 91,
      status: 'Ahead of Schedule',
      startDate: '2022-11-10',
      endDate: '2024-08-01',
      budget: '$15.2M',
      manager: 'Robert Chen'
    },
    {
      id: 4,
      name: 'Harbor View Apartments',
      progress: 45,
      status: 'On Track',
      startDate: '2023-09-05',
      endDate: '2025-06-12',
      budget: '$10.8M',
      manager: 'Maria Rodriguez'
    }
  ];

  // Sample data for reports
  reports = [
    {
      id: 1,
      title: 'Q2 2024 Financial Summary',
      type: 'Financial',
      date: '2024-07-01',
      author: 'Finance Team'
    },
    {
      id: 2,
      title: 'Site Safety Inspection Report',
      type: 'Safety',
      date: '2024-06-28',
      author: 'Safety Department'
    },
    {
      id: 3,
      title: 'Environmental Compliance Audit',
      type: 'Compliance',
      date: '2024-06-15',
      author: 'Environmental Team'
    },
    {
      id: 4,
      title: 'Project Timeline Analysis',
      type: 'Management',
      date: '2024-06-10',
      author: 'Project Management Office'
    }
  ];

  // Project status options
  projectStatuses = ['On Track', 'Delayed', 'Ahead of Schedule', 'On Hold', 'Completed'];

  // Report type options
  reportTypes = ['Financial', 'Safety', 'Compliance', 'Management', 'Progress'];

  // Get filtered projects based on search
  get filteredProjects() {
    if (!this.projectSearchTerm.trim()) {
      return this.projects;
    }
    
    const searchTerm = this.projectSearchTerm.toLowerCase().trim();
    return this.projects.filter(project => {
      return project.name.toLowerCase().includes(searchTerm) || 
             project.manager.toLowerCase().includes(searchTerm) ||
             project.status.toLowerCase().includes(searchTerm) ||
             project.budget.toString().toLowerCase().includes(searchTerm);
    });
  }

  // Get filtered reports based on type
  get filteredReports() {
    if (this.reportFilterType === 'All') {
      return this.reports;
    }
    
    return this.reports.filter(report => report.type === this.reportFilterType);
  }

  // Filter reports by type
  filterReportsByType(type: string) {
    this.reportFilterType = type;
  }

  // View project details
  viewProject(project: any) {
    this.selectedProject = project;
    this.showViewProjectModal = true;
  }

  // Open edit project modal
  editProject(project: any) {
    this.selectedProject = {...project};
    // Format budget for editing (remove currency symbol)
    if (this.selectedProject.budget) {
      this.selectedProject.budget = this.selectedProject.budget.replace(/[^0-9.]/g, '');
    }
    this.showEditProjectModal = true;
  }

  // Confirm delete project
  confirmDeleteProject(project: any) {
    this.selectedProject = project;
    this.showDeleteConfirmModal = true;
  }

  // Delete project
  deleteProject() {
    if (this.selectedProject) {
      this.projects = this.projects.filter(p => p.id !== this.selectedProject.id);
      this.closeModals();
    }
  }

  // Save edited project
  saveEditedProject() {
    if (!this.selectedProject.name || !this.selectedProject.startDate || !this.selectedProject.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Find index of the project to update
    const index = this.projects.findIndex(p => p.id === this.selectedProject.id);
    if (index !== -1) {
      // Format budget with currency symbol
      if (this.selectedProject.budget && !this.selectedProject.budget.startsWith('$')) {
        this.selectedProject.budget = '$' + this.selectedProject.budget;
      }
      
      // Update the project
      this.projects[index] = {...this.selectedProject};
      this.closeModals();
    }
  }

  // Open new project modal
  openNewProjectModal() {
    this.resetNewProject();
    this.showNewProjectModal = true;
  }

  // Open new report modal
  openNewReportModal() {
    this.resetNewReport();
    this.showNewReportModal = true;
  }

  // Close modals
  closeModals() {
    this.showNewProjectModal = false;
    this.showViewProjectModal = false;
    this.showEditProjectModal = false;
    this.showDeleteConfirmModal = false;
    this.showNewReportModal = false;
    this.selectedProject = null;
  }

  // Reset form models
  resetNewProject() {
    this.newProject = {
      name: '',
      startDate: this.formatDate(new Date()),
      endDate: this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // Default to 30 days later
      budget: '',
      manager: ''
    };
  }

  resetNewReport() {
    this.newReport = {
      title: '',
      type: 'Financial',
      author: ''
    };
  }

  // Submit new project
  submitNewProject() {
    // Validate form
    if (!this.newProject.name || !this.newProject.startDate || !this.newProject.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new project object
    const project = {
      id: this.projects.length + 1,
      name: this.newProject.name,
      progress: 0,
      status: 'On Track',
      startDate: this.newProject.startDate,
      endDate: this.newProject.endDate,
      budget: this.newProject.budget ? '$' + this.newProject.budget : '$0',
      manager: this.newProject.manager
    };

    // Add to projects array
    this.projects.unshift(project);
    this.closeModals();
  }

  // Submit new report
  submitNewReport() {
    // Validate form
    if (!this.newReport.title || !this.newReport.author) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new report object
    const report = {
      id: this.reports.length + 1,
      title: this.newReport.title,
      type: this.newReport.type,
      date: this.formatDate(new Date()),
      author: this.newReport.author
    };

    // Add to reports array
    this.reports.unshift(report);
    this.closeModals();
  }

  // Helper function to format date
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get number of reports to display
  get displayedReportCount() {
    return this.showAllReports ? this.filteredReports.length : Math.min(this.maxDisplayedReports, this.filteredReports.length);
  }

  // Get reports to display based on limit
  get visibleReports() {
    return this.filteredReports.slice(0, this.displayedReportCount);
  }

  // Toggle view all reports
  toggleShowAllReports() {
    this.showAllReports = !this.showAllReports;
  }

  // Reset filters and show all reports
  viewAllReports() {
    this.reportFilterType = 'All';
    this.showAllReports = true;
  }
} 