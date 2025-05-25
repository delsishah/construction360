import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private fb: FormBuilder, private _authService: AuthService, private router: Router) {
  }

  form!: FormGroup
  errorMessage!: string;
  ngOnInit(): void {
    this.form = this.fb.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

  }

  submit() {
    if (this.form.valid) {
    }
  }

  async onLogin() {
    if (this.form.invalid) {
      return;
    }

    const { identifier, password } = this.form.value;

    try {
      this._authService.login(identifier, password).subscribe((data) => {
        this.router.navigate(['/dashboard']);
      }
      );
      
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
