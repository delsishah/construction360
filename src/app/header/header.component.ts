import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}
