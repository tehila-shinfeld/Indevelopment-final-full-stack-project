import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  active?: boolean;
}

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('itemSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class NavigationComponent {
  private router = inject(Router);
  
  isExpanded = false;

  navigationItems: NavigationItem[] = [
    { path: '/dashboard', label: 'לוח בקרה', icon: '📊' },
    { path: '/manage-users', label: 'ניהול משתמשים', icon: '👥' },
    { path: '/all-meetings', label: 'כל הפגישות', icon: '📅' },
    { path: '/teams-management', label: 'ניהול צוותים', icon: '🏢' }
  ];

  toggleNav() {
    this.isExpanded = !this.isExpanded;
  }

  navigateAndClose(path: string) {
    this.router.navigate([path]);
    this.isExpanded = false;
  }

  isActiveRoute(path: string): boolean {
    return this.router.url === path;
  }

  logout() {
    // Add logout logic here (clear tokens, user data, etc.)
    console.log('Logging out...');
    this.router.navigate(['/login']);
    this.isExpanded = false;
  }
}