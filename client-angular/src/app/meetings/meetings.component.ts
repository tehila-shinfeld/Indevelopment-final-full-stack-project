import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { NavigationComponent } from "../navigation/navigation.component";

interface Meeting {
  id: number;
  title: string;
  date: Date;
  participants: string[];
  duration: string;
  status: 'completed' | 'pending' | 'cancelled';
  summary: string;
  topics: string[];
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, NavigationComponent],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardHover', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class MeetingsComponent implements OnInit {
  meetings: Meeting[] = [];
  filteredMeetings: Meeting[] = [];
  selectedFilter: string = 'all';
  searchQuery: string = '';
  isLoading: boolean = true;

  ngOnInit() {
    this.loadMeetings();
  }

  loadMeetings() {
    // סימולציה של טעינת נתונים
    setTimeout(() => {
      this.meetings = [
        {
          id: 1,
          title: 'ישיבת צוות פיתוח שבועית',
          date: new Date('2025-05-20'),
          participants: ['דני כהן', 'שרה לוי', 'מיכל רוזן'],
          duration: '45 דקות',
          status: 'completed',
          summary: 'דיון על התקדמות הפרויקט החדש, בחינת באגים קריטיים ותכנון השלבים הבאים. הוחלט על הטמעת תכונות חדשות בגרסה הבאה.',
          topics: ['פיתוח', 'באגים', 'תכנון'],
          priority: 'high'
        },
        {
          id: 2,
          title: 'סקירה חודשית עם הנהלה',
          date: new Date('2025-05-18'),
          participants: ['אורן גולד', 'תמר אביב', 'יוסי מור'],
          duration: '90 דקות',
          status: 'completed',
          summary: 'הצגת תוצאות החודש, ניתוח מדדי ביצועים ותכנון יעדים לחודש הבא. דיון על הקצאת משאבים ועדכון לוח זמנים.',
          topics: ['ביצועים', 'יעדים', 'משאבים'],
          priority: 'high'
        },
        {
          id: 3,
          title: 'ישיבת מוקד לקוחות',
          date: new Date('2025-05-15'),
          participants: ['רינה כהן', 'עמית שמש'],
          duration: '30 דקות',
          status: 'completed',
          summary: 'סקירת פניות לקוחות השבוע, זיהוי מגמות ותכנון שיפורים בשירות. דיון על הטמעת מערכת CRM חדשה.',
          topics: ['שירות לקוחות', 'CRM', 'שיפורים'],
          priority: 'medium'
        },
        {
          id: 4,
          title: 'תכנון אסטרטגי Q3',
          date: new Date('2025-05-25'),
          participants: ['מנכ"ל', 'מנהלי מחלקות'],
          duration: '120 דקות',
          status: 'pending',
          summary: 'תכנון מפורט לרבעון השלישי, הגדרת יעדים אסטרטגיים ותכנון תקציבים.',
          topics: ['אסטרטגיה', 'תכנון', 'תקציבים'],
          priority: 'high'
        },
        {
          id: 5,
          title: 'סדנת חדשנות',
          date: new Date('2025-05-12'),
          participants: ['כל הצוות'],
          duration: '180 דקות',
          status: 'cancelled',
          summary: 'סדנה לעידוד חדשנות וחשיבה יצירתית, פיתוח רעיונות חדשים לשיפור תהליכים.',
          topics: ['חדשנות', 'יצירתיות', 'תהליכים'],
          priority: 'low'
        }
      ];
      this.filteredMeetings = [...this.meetings];
      this.isLoading = false;
    }, 1500);
  }

  filterMeetings(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'all') {
      this.filteredMeetings = [...this.meetings];
    } else {
      this.filteredMeetings = this.meetings.filter(meeting => meeting.status === filter);
    }
  }

  searchMeetings(query: string) {
    this.searchQuery = query;
    if (query.trim() === '') {
      this.filterMeetings(this.selectedFilter);
      return;
    }
    
    this.filteredMeetings = this.meetings.filter(meeting => 
      meeting.title.includes(query) || 
      meeting.summary.includes(query) ||
      meeting.topics.some(topic => topic.includes(query))
    );
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'הושלמה';
      case 'pending': return 'מתוכננת';
      case 'cancelled': return 'בוטלה';
      default: return status;
    }
  }

  getPriorityText(priority: string): string {
    switch (priority) {
      case 'high': return 'גבוהה';
      case 'medium': return 'בינונית';
      case 'low': return 'נמוכה';
      default: return priority;
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCompletedCount(): number {
    return this.meetings.filter(meeting => meeting.status === 'completed').length;
  }

  getPendingCount(): number {
    return this.meetings.filter(meeting => meeting.status === 'pending').length;
  }
}