import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'New Ticket Assigned',
      message: 'A client assigned a new ticket to you.',
      time: '2 min ago',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Ticket Updated',
      message: 'Ticket #23 status changed to IN_PROGRESS.',
      time: '1 hour ago',
      read: true,
      type: 'success'
    },
    {
      id: 3,
      title: 'Meeting Request',
      message: 'Client requested a meeting for ticket #45.',
      time: 'Yesterday',
      read: false,
      type: 'warning'
    }
  ];

  markAsRead(notification: NotificationItem) {
    notification.read = true;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }
}
