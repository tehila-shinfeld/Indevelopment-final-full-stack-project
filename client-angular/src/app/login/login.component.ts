import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  isLoading = signal(false);
  showPassword = signal(false);
  loginError = signal('');
  isFormValid = signal(false);

  constructor(private router: Router, private authService: AuthService) {}

  onUsernameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.username.set(target.value);
    this.validateForm();
  }

  onPasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.password.set(target.value);
    this.validateForm();
  }

  validateForm() {
    this.isFormValid.set(
      this.username().trim().length >= 3 && this.password().length >= 6
    );
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (!this.isFormValid()) return;

    this.isLoading.set(true);
    this.loginError.set('');

    this.authService.login(this.username(), this.password()).subscribe({
      next: () => {
        sessionStorage.setItem('username', this.username());
        this.router.navigate(['/dashboard']);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.loginError.set('שם משתמש או סיסמה שגויים');
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
}
