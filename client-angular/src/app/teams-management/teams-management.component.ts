import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { LucideAngularModule, Users, Building2, Crown, Eye, Settings, Search, Filter, MoreVertical } from 'lucide-angular';
import { NavigationComponent } from "../navigation/navigation.component";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive';
  lastSeen: string;
}

interface Company {
  id: number;
  name: string;
  logo: string;
  totalUsers: number;
  activeUsers: number;
  manager: {
    name: string;
    email: string;
    avatar: string;
  };
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'suspended';
  createdAt: string;
  members: TeamMember[];
  growth: number;
}

@Component({
  selector: 'app-teams-management',
  imports: [CommonModule, LucideAngularModule, NavigationComponent],
  templateUrl: './teams-management.component.html',
  styleUrl: './teams-management.component.css',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', 
                style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', 
                    style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardHover', [
      state('hover', style({ transform: 'translateY(-8px) scale(1.02)' })),
      state('default', style({ transform: 'translateY(0) scale(1)' })),
      transition('default <=> hover', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class TeamsManagementComponent {
  // Icons
  readonly UsersIcon = Users;
  readonly BuildingIcon = Building2;
  readonly CrownIcon = Crown;
  readonly EyeIcon = Eye;
  readonly SettingsIcon = Settings;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly MoreIcon = MoreVertical;

  companies: Company[] = [
    {
      id: 1,
      name: 'TechFlow Solutions',
      logo: '🚀',
      totalUsers: 45,
      activeUsers: 42,
      manager: {
        name: 'Sarah Cohen',
        email: 'sarah@techflow.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056c259?w=150'
      },
      plan: 'enterprise',
      status: 'active',
      createdAt: '2024-01-15',
      growth: 12,
      members: [
        {
          id: 1,
          name: 'David Levy',
          role: 'Developer',
          email: 'david@techflow.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          status: 'active',
          lastSeen: '2 דקות'
        },
        {
          id: 2,
          name: 'Maya Rosen',
          role: 'Designer',
          email: 'maya@techflow.com',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          status: 'active',
          lastSeen: '5 דקות'
        }
      ]
    },
    {
      id: 2,
      name: 'Digital Innovations',
      logo: '💡',
      totalUsers: 28,
      activeUsers: 25,
      manager: {
        name: 'Amit Goldberg',
        email: 'amit@digital-inn.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      plan: 'premium',
      status: 'active',
      createdAt: '2024-02-20',
      growth: 8,
      members: [
        {
          id: 3,
          name: 'Noa Ben-David',
          role: 'Product Manager',
          email: 'noa@digital-inn.com',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          status: 'active',
          lastSeen: '1 שעה'
        }
      ]
    },
    {
      id: 3,
      name: 'StartUp Hub',
      logo: '⭐',
      totalUsers: 15,
      activeUsers: 12,
      manager: {
        name: 'Ron Shapira',
        email: 'ron@startuphub.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      plan: 'basic',
      status: 'active',
      createdAt: '2024-03-10',
      growth: 25,
      members: []
    }
  ];

  selectedCompany: Company | null = null;
  searchQuery = '';
  selectedFilter = 'all';
  showMembersModal = false;

  filteredCompanies = this.companies;

  ngOnInit() {
    this.updateFilteredCompanies();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.updateFilteredCompanies();
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    this.updateFilteredCompanies();
  }

  updateFilteredCompanies() {
    let filtered = this.companies;

    if (this.searchQuery) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        company.manager.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(company => {
        switch (this.selectedFilter) {
          case 'enterprise': return company.plan === 'enterprise';
          case 'premium': return company.plan === 'premium';
          case 'basic': return company.plan === 'basic';
          case 'high-growth': return company.growth > 10;
          default: return true;
        }
      });
    }

    this.filteredCompanies = filtered;
  }

  viewCompanyMembers(company: Company) {
    this.selectedCompany = company;
    this.showMembersModal = true;
  }

  closeMembersModal() {
    this.showMembersModal = false;
    this.selectedCompany = null;
  }

  getPlanColor(plan: string): string {
    switch (plan) {
      case 'enterprise': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'basic': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gray-500';
    }
  }

  getPlanText(plan: string): string {
    switch (plan) {
      case 'enterprise': return 'ארגוני';
      case 'premium': return 'פרימיום';
      case 'basic': return 'בסיסי';
      default: return plan;
    }
  }

  getGrowthColor(growth: number): string {
    if (growth > 15) return 'text-green-500';
    if (growth > 5) return 'text-blue-500';
    return 'text-gray-500';
  }

  getTotalUsers(): number {
    return this.companies.reduce((sum, company) => sum + company.totalUsers, 0);
  }

  getTotalActiveUsers(): number {
    return this.companies.reduce((sum, company) => sum + company.activeUsers, 0);
  }
}