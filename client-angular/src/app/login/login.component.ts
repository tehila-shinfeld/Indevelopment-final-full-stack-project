import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
      this.username().length >= 3 && this.password().length >= 6
    );
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  async onSubmit() {
    if (!this.isFormValid()) return;

    this.isLoading.set(true);
    this.loginError.set('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication logic
      if (this.username() === 'admin' && this.password() === 'password123') {
        const mockToken = 'jwt-token-' + Date.now();
        sessionStorage.setItem('authToken', mockToken);
        sessionStorage.setItem('username', this.username());
        
        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError.set('שם משתמש או סיסמה שגויים');
      }
    } catch (error) {
      this.loginError.set('שגיאה בהתחברות, נסה שוב');
    } finally {
      this.isLoading.set(false);
    }
  }
}