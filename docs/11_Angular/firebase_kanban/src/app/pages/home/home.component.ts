import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  user$: Observable<User | null>;

  constructor(private authService: AuthenticationService) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit() {}
}
