import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private _authService: AuthService,  private router: Router) {}

  signOut() {
    this._authService.logout().subscribe((data)=> {
      this.router.navigate(['/login']);
    });
  }
}
