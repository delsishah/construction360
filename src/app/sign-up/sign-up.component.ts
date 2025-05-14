import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  errorMessage!: string;
  successMessage!: string;

  constructor(private fb: FormBuilder, private _authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[A-Za-z][A-Za-z .,-]*$')]],
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submit() {
    if (this.form.valid) {
      const { identifier, password } = this.form.value;

      this._authService.register(identifier, password).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.errorMessage = 'Registration failed. Email may already be in use.';
          this.successMessage = '';
        }
      });
    }
  }
}
