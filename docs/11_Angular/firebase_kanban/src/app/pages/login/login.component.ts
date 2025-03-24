import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private toast: HotToastService
  ) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.authService
      .login(email, password)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in... ',
          error: 'There was an error',
        })
      )
      .subscribe(() => {
        this.router.navigate(['/tasks']);
      });
  }
}
