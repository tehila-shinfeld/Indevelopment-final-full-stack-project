import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

interface DashboardStats {
  activeUsers: number;
  monthlyNewUsers: number;
  weeklyMeetings: number;
  previousWeekMeetings: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.8s 0.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('0.8s 0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.8s 0.6s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('pulseAnimation', [
      state('*', style({ transform: 'scale(1)' })),
      transition('* => *', [
        animate('0.3s ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.05)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('hoverScale', [
      state('idle', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.02)' })),
      transition('idle <=> hover', animate('0.2s ease-in-out'))
    ]),
    trigger('barAnimation', [
      transition(':enter', [
        style({ height: '0%', opacity: 0 }),
        animate('1s ease-out', style({ height: '*', opacity: 1 }))
      ])
    ]),
    trigger('floatingAnimation', [
      transition(':enter', [
        animate('20s linear', keyframes([
          style({ transform: 'translateY(0px) rotate(0deg)', offset: 0 }),
          style({ transform: 'translateY(-20px) rotate(90deg)', offset: 0.25 }),
          style({ transform: 'translateY(0px) rotate(180deg)', offset: 0.5 }),
          style({ transform: 'translateY(20px) rotate(270deg)', offset: 0.75 }),
          style({ transform: 'translateY(0px) rotate(360deg)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  
  // Data properties
  stats: DashboardStats = {
    activeUsers: 1247,
    monthlyNewUsers: 156,
    weeklyMeetings: 89,
    previousWeekMeetings: 67
  };

  // Display counters for animations
  displayActiveUsers = 0;
  displayMonthlyUsers = 0;
  displayWeeklyMeetings = 0;
  
  monthlyProgress = 0;
  meetingsTrend = 0;
  isLoading = true;
  
  Math = Math;

  chartData = [
    { label: 'ינו', value: 85 },
    { label: 'פבר', value: 92 },
    { label: 'מרץ', value: 78 },
    { label: 'אפר', value: 95 },
    { label: 'מאי', value: 88 },
    { label: 'יונ', value: 76 }
  ];

  private animationIntervals: any[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
      this.startCounterAnimations();
      this.calculateTrends();
      this.loadDashboardData();
    }, 500);
  }

  ngOnDestroy() {
    this.animationIntervals.forEach(interval => clearInterval(interval));
  }

  private startCounterAnimations() {
    // Active Users Counter
    this.animateCounter('activeUsers', this.stats.activeUsers, 2000);
    
    // Monthly Users Counter
    setTimeout(() => {
      this.animateCounter('monthlyUsers', this.stats.monthlyNewUsers, 1500);
      this.animateProgress();
    }, 500);
    
    // Weekly Meetings Counter
    setTimeout(() => {
      this.animateCounter('weeklyMeetings', this.stats.weeklyMeetings, 1200);
    }, 1000);
  }

  private animateCounter(type: string, target: number, duration: number) {
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      
      switch(type) {
        case 'activeUsers':
          this.displayActiveUsers = Math.floor(current);
          break;
        case 'monthlyUsers':
          this.displayMonthlyUsers = Math.floor(current);
          break;
        case 'weeklyMeetings':
          this.displayWeeklyMeetings = Math.floor(current);
          break;
      }
    }, stepTime);

    this.animationIntervals.push(interval);
  }

  private animateProgress() {
    let progress = 0;
    const targetProgress = 67;
    const interval = setInterval(() => {
      progress += 2;
      if (progress >= targetProgress) {
        progress = targetProgress;
        clearInterval(interval);
      }
      this.monthlyProgress = progress;
    }, 30);

    this.animationIntervals.push(interval);
  }

  private calculateTrends() {
    this.meetingsTrend = Math.round(((this.stats.weeklyMeetings - this.stats.previousWeekMeetings) / this.stats.previousWeekMeetings) * 100);
  }

  private async loadDashboardData() {
    // Simulate API call
    try {
      // Replace with actual API call
      // const response = await this.dashboardService.getStats();
      // this.stats = response;
      console.log('Loading dashboard data...');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  // Updated navigation methods based on your routing configuration
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Specific navigation methods for dashboard links
  navigateToManageUsers() {
    this.router.navigate(['/manage-users']);
  }

  navigateToAllMeetings() {
    this.router.navigate(['/all-meetings']);
  }

  navigateToTeamsManagement() {
    this.router.navigate(['/teams-management']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Navigation methods for quick access cards/buttons
  goToUserManagement() {
    this.navigateToManageUsers();
  }

  goToMeetings() {
    this.navigateToAllMeetings();
  }

  goToTeams() {
    this.navigateToTeamsManagement();
  }

  logout() {
    // Implement logout logic
    console.log('Logging out...');
    // Clear any stored user data/tokens here
    this.router.navigate(['/login']);
  }

  getTrendClass(trend: number): string {
    return trend > 0 ? 'positive' : 'negative';
  }

  getTrendIcon(trend: number): string {
    return trend > 0 ? '↗' : '↘';
  }
}