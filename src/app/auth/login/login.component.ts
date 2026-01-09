import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  hidePassword = true;
  loading = false;

  // ❌ REMOVED: authService: any;
  // ❌ REMOVED: snackBar: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,   // ✅ INJECTED
    private snackBar: MatSnackBar,      // ✅ INJECTED
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.getRawValue();

    this.loading = true;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          err?.error?.message || 'Invalid credentials',
          'Close',
          { duration: 4000 }
        );
      }
    });
  }
}
