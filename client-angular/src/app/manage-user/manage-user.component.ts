import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { NavigationComponent } from "../navigation/navigation.component";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: Date;
  avatar: string;
}

@Component({
  selector: 'app-manage-user',
  imports: [CommonModule, FormsModule, NavigationComponent],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(100px)', opacity: 0 }),
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeInStagger', [
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
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('slideModal', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', 
          style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ManageUserComponent {
  users: User[] = [
    {
      id: 1,
      name: 'יונתן כהן',
      email: 'yonatan@example.com',
      role: 'מנהל מערכת',
      status: 'active',
      joinDate: new Date('2023-01-15'),
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'שרה לוי',
      email: 'sarah@example.com',
      role: 'מנהלת תוכן',
      status: 'active',
      joinDate: new Date('2023-03-22'),
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e938e8?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'דוד אברמוביץ',
      email: 'david@example.com',
      role: 'מפתח',
      status: 'inactive',
      joinDate: new Date('2023-05-10'),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'רחל גולדברג',
      email: 'rachel@example.com',
      role: 'מעצבת UX/UI',
      status: 'active',
      joinDate: new Date('2023-07-18'),
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'אמיר רוזן',
      email: 'amir@example.com',
      role: 'מתמחה',
      status: 'active',
      joinDate: new Date('2023-09-05'),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  showAddUserModal = false;
  showEditUserModal = false;
  showEmailModal = false;
  selectedUser: User | null = null;
  
  newUser: Partial<User> = {
    name: '',
    email: '',
    role: '',
    status: 'active'
  };

  emailSubject = '';
  emailMessage = '';
  searchTerm = '';
  selectedRole = '';

  roles = ['מנהל מערכת', 'מנהלת תוכן', 'מפתח', 'מעצבת UX/UI', 'מתמחה'];

  get filteredUsers() {
    return this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });
  }

  openAddUserModal() {
    this.newUser = { name: '', email: '', role: '', status: 'active' };
    this.showAddUserModal = true;
  }

  openEditUserModal(user: User) {
    this.selectedUser = { ...user };
    this.showEditUserModal = true;
  }

  openEmailModal() {
    this.emailSubject = '';
    this.emailMessage = '';
    this.showEmailModal = true;
  }

  closeModal() {
    this.showAddUserModal = false;
    this.showEditUserModal = false;
    this.showEmailModal = false;
    this.selectedUser = null;
  }

  addUser() {
    if (this.newUser.name && this.newUser.email && this.newUser.role) {
      const user: User = {
        id: Math.max(...this.users.map(u => u.id)) + 1,
        name: this.newUser.name,
        email: this.newUser.email,
        role: this.newUser.role,
        status: this.newUser.status || 'active',
        joinDate: new Date(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.newUser.name)}&background=6366f1&color=fff&size=150`
      };
      this.users.unshift(user);
      this.closeModal();
    }
  }

  updateUser() {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.users[index] = { ...this.selectedUser };
        this.closeModal();
      }
    }
  }

  deleteUser(userId: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      this.users = this.users.filter(u => u.id !== userId);
    }
  }

  sendEmailToAll() {
    if (this.emailSubject && this.emailMessage) {
      // כאן תוכלי להוסיף את הלוגיקה לשליחת המייל
      console.log('שליחת מייל לכל המשתמשים:', {
        subject: this.emailSubject,
        message: this.emailMessage,
        recipients: this.users.map(u => u.email)
      });
      
      // הצגת הודעת הצלחה
      alert(`המייל נשלח בהצלחה ל-${this.users.length} משתמשים!`);
      this.closeModal();
    }
  }

  getStatusColor(status: string): string {
    return status === 'active' ? '#10b981' : '#ef4444';
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'מנהל מערכת': '#8b5cf6',
      'מנהלת תוכן': '#f59e0b',
      'מפתח': '#3b82f6',
      'מעצבת UX/UI': '#ec4899',
      'מתמחה': '#6b7280'
    };
    return colors[role] || '#6b7280';
  }
}