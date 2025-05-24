import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationItem } from '@/components/app/notification/NotificationDropdown';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  
  // Actions
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: NotificationItem) => void;
  removeNotification: (notificationId: number) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      
      // Set all notifications
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.read).length;
        set({ notifications, unreadCount });
      },
      
      // Add a new notification
      addNotification: (notification) => 
        set((state) => {
          // Don't add duplicate notifications
          if (state.notifications.some(n => n.id === notification.id)) {
            return state;
          }
          
          const newNotifications = [notification, ...state.notifications];
          const unreadCount = newNotifications.filter(n => !n.read).length;
          return { 
            notifications: newNotifications,
            unreadCount 
          };
        }),
      
      // Remove a notification
      removeNotification: (notificationId) => 
        set((state) => {
          const newNotifications = state.notifications.filter(
            n => n.id !== notificationId
          );
          const unreadCount = newNotifications.filter(n => !n.read).length;
          return { 
            notifications: newNotifications,
            unreadCount 
          };
        }),
      
      // Mark a notification as read
      markAsRead: (notificationId) => 
        set((state) => {
          const newNotifications = state.notifications.map(n => 
            n.id === notificationId 
              ? { ...n, read: true } 
              : n
          );
          const unreadCount = newNotifications.filter(n => !n.read).length;
          return { 
            notifications: newNotifications,
            unreadCount 
          };
        }),
      
      // Mark all notifications as read
      markAllAsRead: () => 
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        })),
      
      // Clear all notifications
      clearNotifications: () => 
        set({ 
          notifications: [],
          unreadCount: 0 
        }),
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ 
        notifications: state.notifications,
        unreadCount: state.unreadCount
      }),
    }
  )
); 