import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-project-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-goals.component.html',
  styleUrl: './project-goals.component.css'
})
export class ProjectGoalsComponent {
  // Modal display flags
  showNewGoalModal = false;
  showViewGoalModal = false;
  showEditGoalModal = false;
  showDeleteConfirmModal = false;

  // Search term
  goalSearchTerm = '';
  statusFilter = 'All';

  // Selected goal for view/edit/delete
  selectedGoal: any = null;

  // New goal model
  newGoal = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'In Progress',
    progress: 0,
    assignedTo: ''
  };

  // Status options
  statusOptions = ['Not Started', 'In Progress', 'At Risk', 'Completed', 'On Hold'];
  
  // Priority options
  priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  // Sample data for goals
  goals = [
    {
      id: 1,
      title: 'Complete Foundation Work',
      description: 'Finalize all foundation and structural base work for the main building.',
      dueDate: '2024-08-15',
      priority: 'High',
      status: 'In Progress',
      progress: 65,
      assignedTo: 'Engineering Team'
    },
    {
      id: 2,
      title: 'Obtain Building Permits',
      description: 'Secure all necessary permits and regulatory approvals for the next phase.',
      dueDate: '2024-07-30',
      priority: 'Critical',
      status: 'Completed',
      progress: 100,
      assignedTo: 'Legal Department'
    },
    {
      id: 3,
      title: 'Material Procurement',
      description: 'Source and procure all required materials for Q3 construction needs.',
      dueDate: '2024-09-10',
      priority: 'Medium',
      status: 'At Risk',
      progress: 40,
      assignedTo: 'Procurement Team'
    },
    {
      id: 4,
      title: 'Safety Inspection',
      description: 'Conduct quarterly safety inspection and compliance review.',
      dueDate: '2024-07-25',
      priority: 'High',
      status: 'Not Started',
      progress: 0,
      assignedTo: 'Safety Officer'
    },
    {
      id: 5,
      title: 'Finalize Architectural Plans',
      description: 'Complete all architectural drawings and specifications for phase 2.',
      dueDate: '2024-10-05',
      priority: 'Medium',
      status: 'In Progress',
      progress: 75,
      assignedTo: 'Design Team'
    }
  ];

  // Get filtered goals based on search and status filter
  get filteredGoals() {
    let filtered = this.goals;
    
    // Apply status filter
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(goal => goal.status === this.statusFilter);
    }
    
    // Apply search term
    if (this.goalSearchTerm.trim()) {
      const searchTerm = this.goalSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(goal => {
        return goal.title.toLowerCase().includes(searchTerm) || 
               goal.description.toLowerCase().includes(searchTerm) ||
               goal.assignedTo.toLowerCase().includes(searchTerm);
      });
    }
    
    return filtered;
  }

  // Get counts by status for dashboard
  get statusCounts() {
    const counts = {
      total: this.goals.length,
      completed: this.goals.filter(g => g.status === 'Completed').length,
      inProgress: this.goals.filter(g => g.status === 'In Progress').length,
      atRisk: this.goals.filter(g => g.status === 'At Risk').length,
      notStarted: this.goals.filter(g => g.status === 'Not Started').length,
      onHold: this.goals.filter(g => g.status === 'On Hold').length
    };
    
    return counts;
  }

  // Overall completion percentage
  get overallProgress() {
    if (this.goals.length === 0) return 0;
    const totalProgress = this.goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / this.goals.length);
  }

  // View goal details
  viewGoal(goal: any) {
    this.selectedGoal = {...goal};
    this.showViewGoalModal = true;
  }

  // Open edit goal modal
  editGoal(goal: any) {
    this.selectedGoal = {...goal};
    this.showEditGoalModal = true;
  }

  // Confirm delete goal
  confirmDeleteGoal(goal: any) {
    this.selectedGoal = goal;
    this.showDeleteConfirmModal = true;
  }

  // Delete goal
  deleteGoal() {
    if (this.selectedGoal) {
      this.goals = this.goals.filter(g => g.id !== this.selectedGoal.id);
      this.closeModals();
    }
  }

  // Save edited goal
  saveEditedGoal() {
    if (!this.validateGoal(this.selectedGoal)) return;

    // Find index of the goal to update
    const index = this.goals.findIndex(g => g.id === this.selectedGoal.id);
    if (index !== -1) {
      // Update the goal
      this.goals[index] = {...this.selectedGoal};
      
      // Set progress to 100% if status is Completed
      if (this.goals[index].status === 'Completed' && this.goals[index].progress !== 100) {
        this.goals[index].progress = 100;
      }
      
      this.closeModals();
    }
  }

  // Open new goal modal
  openNewGoalModal() {
    this.resetNewGoal();
    this.showNewGoalModal = true;
  }

  // Close all modals
  closeModals() {
    this.showNewGoalModal = false;
    this.showViewGoalModal = false;
    this.showEditGoalModal = false;
    this.showDeleteConfirmModal = false;
    this.selectedGoal = null;
  }

  // Reset new goal form
  resetNewGoal() {
    this.newGoal = {
      title: '',
      description: '',
      dueDate: this.formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // Default to 2 weeks later
      priority: 'Medium',
      status: 'In Progress',
      progress: 0,
      assignedTo: ''
    };
  }

  // Submit new goal
  submitNewGoal() {
    if (!this.validateGoal(this.newGoal)) return;

    // Create new goal object
    const goal = {
      id: this.goals.length + 1,
      ...this.newGoal
    };

    // Set progress to 100% if status is Completed
    if (goal.status === 'Completed') {
      goal.progress = 100;
    }

    // Add to goals array
    this.goals.unshift(goal);
    this.closeModals();
  }

  // Validate goal data
  validateGoal(goal: any): boolean {
    if (!goal.title) {
      alert('Please enter a goal title');
      return false;
    }
    if (!goal.dueDate) {
      alert('Please select a due date');
      return false;
    }
    return true;
  }

  // Helper function to format date
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Mark goal as complete
  markAsComplete(goal: any) {
    const index = this.goals.findIndex(g => g.id === goal.id);
    if (index !== -1) {
      this.goals[index].status = 'Completed';
      this.goals[index].progress = 100;
    }
  }

  // Update status filter
  updateStatusFilter(status: string) {
    this.statusFilter = status;
  }
} 