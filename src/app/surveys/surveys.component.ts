import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Survey {
  id: number;
  title: string;
  with: string;
  team: string;
  type: string;
  date: string;
  description?: string; // Optional field
}

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.css'
})
export class SurveysComponent {
  @ViewChild('surveyForm') surveyForm!: NgForm;
  @ViewChild('sortDropdown') sortDropdown!: ElementRef;

  // Modal control
  showNewSurveyModal = false;
  
  // Dropdown control
  isDropdownOpen = false;

  // Filter options
  selectedTeam: string = 'All';
  selectedType: string = 'All';

  // Sort option
  currentSortOption: string = 'dateDesc'; // Default sort: Date (Newest)
  
  // Define teams and types for filtering
  teams = ['All', 'Marketing', 'Operations', 'Site Security', 'HR Department', 'Project Team'];
  types = ['All', 'Public', 'Reviews', 'Internal'];

  // Sort options
  sortOptions = [
    { id: 'dateDesc', label: 'Date (Newest)' },
    { id: 'dateAsc', label: 'Date (Oldest)' },
    { id: 'titleAsc', label: 'Title (A-Z)' },
    { id: 'titleDesc', label: 'Title (Z-A)' }
  ];

  // New survey model
  newSurvey: Partial<Survey> = {
    title: '',
    with: '',
    team: 'Marketing', // Default values
    type: 'Internal',
    date: this.formatDateForInput(new Date())
  };

  // Sample survey data
  allSurveys: Survey[] = [
    {
      id: 1,
      title: 'Collaboration Check-In',
      with: 'Team Lead',
      team: 'Project Team',
      type: 'Internal',
      date: '2023-12-10'
    },
    {
      id: 2,
      title: 'Development Program',
      with: 'Mentor',
      team: 'Marketing',
      type: 'Internal',
      date: '2023-11-25'
    },
    {
      id: 3,
      title: 'Onboarding Progress',
      with: 'Trainer',
      team: 'HR Department',
      type: 'Internal',
      date: '2023-12-05'
    },
    {
      id: 4,
      title: 'Training Needs Assessment',
      with: 'Training Specialist',
      team: 'Marketing',
      type: 'Internal',
      date: '2023-11-15'
    },
    {
      id: 5,
      title: 'Customer Satisfaction Survey',
      with: 'Client Representative',
      team: 'Operations',
      type: 'Public',
      date: '2023-12-15'
    },
    {
      id: 6,
      title: 'Project Performance Review',
      with: 'Project Manager',
      team: 'Site Security',
      type: 'Reviews',
      date: '2023-12-01'
    }
  ];

  // Filtered surveys based on selected filters
  filteredSurveys = [...this.allSurveys];

  // Listen for clicks outside to close dropdown
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isDropdownOpen && this.sortDropdown && !this.sortDropdown.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  // Get the current sort option label
  get currentSortLabel(): string {
    const option = this.sortOptions.find(opt => opt.id === this.currentSortOption);
    return option ? option.label : 'Date (Newest)';
  }

  // Method to apply filters
  applyFilters() {
    this.filteredSurveys = this.allSurveys.filter(survey => {
      // Filter by team
      const teamMatch = this.selectedTeam === 'All' || survey.team === this.selectedTeam;
      
      // Filter by type
      const typeMatch = this.selectedType === 'All' || survey.type === this.selectedType;
      
      return teamMatch && typeMatch;
    });
    
    // Apply current sort
    this.applySorting();
  }

  // Method to apply sorting
  applySorting() {
    switch (this.currentSortOption) {
      case 'dateDesc':
        this.filteredSurveys.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'dateAsc':
        this.filteredSurveys.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'titleAsc':
        this.filteredSurveys.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        this.filteredSurveys.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default to newest first
        this.filteredSurveys.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  // Method to toggle type filter directly
  setTypeFilter(type: string) {
    this.selectedType = this.selectedType === type ? 'All' : type;
    this.applyFilters();
  }

  // Method to change sort option
  setSortOption(sortId: string) {
    this.currentSortOption = sortId;
    this.applySorting();
  }

  // Method to reset all filters
  resetFilters() {
    this.selectedTeam = 'All';
    this.selectedType = 'All';
    this.filteredSurveys = [...this.allSurveys];
    this.applySorting();
  }

  // Method to view survey details (placeholder)
  viewSurveyDetails(id: number) {
    console.log('Viewing survey details for ID:', id);
    // Here you would implement navigation to survey details page
  }
  
  // Open the new survey modal
  openNewSurveyModal() {
    this.resetNewSurveyForm();
    this.showNewSurveyModal = true;
  }

  // Close the modal
  closeModal(event: Event) {
    // Only close if clicking backdrop or close button
    if (
      event.target === event.currentTarget || 
      (event.target as HTMLElement).classList.contains('btn-close')
    ) {
      this.showNewSurveyModal = false;
    }
  }

  // Reset the new survey form
  resetNewSurveyForm() {
    this.newSurvey = {
      title: '',
      with: '',
      team: 'Marketing',
      type: 'Internal',
      date: this.formatDateForInput(new Date())
    };
    
    // Reset form validation if the form exists
    if (this.surveyForm) {
      this.surveyForm.resetForm(this.newSurvey);
    }
  }
  
  // Method to create new survey entry
  createNewSurvey() {
    if (!this.isValidSurvey(this.newSurvey)) {
      return;
    }

    // Generate new ID (in a real app this would be handled by the backend)
    const maxId = Math.max(...this.allSurveys.map(s => s.id), 0);
    const newSurveyComplete: Survey = {
      id: maxId + 1,
      title: this.newSurvey.title!,
      with: this.newSurvey.with!,
      team: this.newSurvey.team!,
      type: this.newSurvey.type!,
      date: this.newSurvey.date!,
      description: this.newSurvey.description
    };

    // Add to beginning of array
    this.allSurveys.unshift(newSurveyComplete);
    
    // Re-apply current filters
    this.applyFilters();
    
    // Close the modal
    this.showNewSurveyModal = false;
    
    // Display success message (could be replaced with a toast notification)
    console.log('Survey created successfully:', newSurveyComplete);
  }

  // Helper method to validate survey
  private isValidSurvey(survey: Partial<Survey>): boolean {
    return !!(
      survey.title && 
      survey.with && 
      survey.team && 
      survey.type && 
      survey.date
    );
  }

  // Helper method to format date for input field
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
