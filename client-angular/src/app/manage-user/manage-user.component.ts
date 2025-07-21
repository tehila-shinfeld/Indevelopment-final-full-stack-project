import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { NavigationComponent } from "../navigation/navigation.component";
import { User } from '../models/User';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],  // תיקון כאן מ-styleUrl ל-styleUrls
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(100px)', opacity: 0 }),
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('fadeInStagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('500ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ManageUserComponent implements OnInit {
  users: User[] = [];
  avatars: string[] = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b2e938e8?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F3%2F37%2FOryctolagus_cuniculus_Tasmania_2.jpg%2F1200px-Oryctolagus_cuniculus_Tasmania_2.jpg&tbnid=HJC1wS6Ccfn3KM&vet=1&imgrefurl=https%3A%2F%2Fhe.wikipedia.org%2Fwiki%2F%25D7%2590%25D7%25A8%25D7%25A0%25D7%2591%25D7%2595%25D7%259F_%25D7%259E%25D7%25A6%25D7%2595%25D7%2599&docid=5qGR8fzRvio0qM&w=1200&h=1500&source=sh%2Fx%2Fim%2Fm1%2F1&kgs=32836362cd233afa'
  ,'https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.dogs-cats.co.il%2Fstores%2F20265%2Fzoom%2F1321533054-2.jpg&tbnid=DZVaH3YwhIGkOM&vet=1&imgrefurl=https%3A%2F%2Fwww.dogs-cats.co.il%2Fproducts%2F910777%2F%25D7%2590%25D7%25A8%25D7%25A0%25D7%2591-%25D7%25A9%25D7%259E%25D7%2595%25D7%2598-%25D7%2590%25D7%2595%25D7%2596%25D7%25A0%25D7%2599%25D7%2599%25D7%259D%3Fsrsltid%3DAfmBOooWyUSzjVsf7Deg28k4kxasgdGW2kw2SWEqlp_pcyYyooMmhHvn&docid=UpHOscW5s8LrWM&w=500&h=498&source=sh%2Fx%2Fim%2Fm1%2F1&kgs=59674135a9e38e0e',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Fbubabuba.com%2Fwp-content%2Fuploads%2F2017%2F01%2Fbunny4.jpg&tbnid=gQvy_Gk84kL5iM&vet=1&imgrefurl=https%3A%2F%2Fbubabuba.com%2Fshop%2Fbuying-costumes%2Fbunny%2F&docid=Vu4250TN2ar8bM&w=800&h=1200&source=sh%2Fx%2Fim%2Fm1%2F1&kgs=657859adf06e1294'
  ];
  
  selectedUser: User | null = null;
  showAddUserModal = false;
  showEditUserModal = false;
  showEmailModal = false;

  emailSubject = '';
  emailMessage = '';
  searchTerm = '';
  selectedRole = '';
  roles: string[] = ['Admin', 'User'];
  newUser: Partial<User> = {
    username: '',
    email: '',
    passwordHash: '',
    company: '',
    role: ''
  };

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: () => alert('שגיאה בטעינת המשתמשים מהשרת.')
    });
  }

  get filteredUsers() {
    return this.users.filter(user => {
      const search = this.searchTerm.toLowerCase();
      const matchesSearch = user.username.toLowerCase().includes(search) ||
                            user.email.toLowerCase().includes(search);
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });
  }

  openAddUserModal() {
    this.newUser = {
      username: '',
      email: '',
      passwordHash: '',
      company: '',
      role: ''
    };
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
    console.log(this.newUser.username);
    console.log(this.newUser.email);
    console.log(this.newUser.passwordHash);
    console.log(this.newUser.company);
    console.log(this.newUser.role);
    if (this.newUser.username && this.newUser.email && this.newUser.passwordHash && this.newUser.company) {
      console.log("add")

      const user = new User(
        this.newUser.username,
        this.newUser.email,
        this.newUser.passwordHash,
        this.newUser.company,
        this.newUser.role || ''
      );

      this.userService.addUser(user).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: () => alert('שגיאה בהוספת המשתמש.')
      });
    }
  }

  updateUser() {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: () => alert('שגיאה בעדכון המשתמש.')
      });
    }
  }

  deleteUser(user: User) {
    if (confirm(`האם את בטוחה שברצונך למחוק את ${user.username}?`)) {
      if(user.id){
        this.userService.deleteUser(user.id).subscribe({
          next: () => this.loadUsers(),
          error: () => alert('שגיאה במחיקת המשתמש.')
        });
      }
    }
  }

  sendEmailToAll() {
    if (this.emailSubject && this.emailMessage) {
      console.log('שליחת מייל לכל המשתמשים:', {
        subject: this.emailSubject,
        message: this.emailMessage,
        recipients: this.users.map(u => u.email)
      });

      alert(`המייל נשלח בהצלחה ל-${this.users.length} משתמשים!`);
      this.closeModal();
    }
  }

  getRoleColor(role?: string): string {
    const colors: { [key: string]: string } = {
      'Admin': '#8b5cf6',
      'User': '#f59e0b',
    };
    return role ? (colors[role] || '#6b7280') : '#6b7280';
  }
}
