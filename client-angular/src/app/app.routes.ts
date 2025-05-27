import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { TeamsManagementComponent } from './teams-management/teams-management.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
    { 
    path: 'manage-users', 
    component: ManageUserComponent 
  },
      { 
    path: 'all-meetings', 
    component: MeetingsComponent 
  },
  { 
    path: 'dashboard', 
    component:DashboardComponent
  },
   { 
    path: 'teams-management', 
    component:TeamsManagementComponent
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];