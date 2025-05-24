import { BaseService } from '../base/base';
import { NotificationItem } from '@/components/app/notification/NotificationDropdown';
import { AxiosResponse } from 'axios';

export interface NotificationResponse {
  notifications: NotificationItem[];
  total: number;
}

class NotificationService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Get all notifications for a user
   * @param userId - The user ID
   * @param limit - Number of notifications to return
   * @param page - Page number
   */
  async getNotifications(userId: number, limit: number = 10, page: number = 1): Promise<NotificationResponse> {
    try {
      return await this.get<NotificationResponse>(`/notifications?user_id=${userId}&limit=${limit}&page=${page}`);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return { notifications: [], total: 0 };
    }
  }

  /**
   * Mark a notification as read
   * @param notificationId - The notification ID
   */
  async markAsRead(notificationId: number): Promise<void> {
    try {
      await this.put<void>(`/notifications/read?notification_id=${notificationId}`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Delete a specific notification
   * @param notificationId - The notification ID
   */
  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await this.delete<void>(`/notifications/delete?notification_id=${notificationId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }

  /**
   * Delete all notifications for a user
   * @param userId - The user ID
   */
  async deleteAllNotifications(userId: number): Promise<void> {
    try {
      await this.delete<void>(`/notifications/delete-all?user_id=${userId}`);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  }
}

export const notificationService = new NotificationService(); 