import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/app/notification';
import { useStore } from '@/store/useStore';

export const useNotificationQuery = (options?: { 
  limit?: number; 
  page?: number; 
  enabled?: boolean; 
}) => {
  const { user } = useStore();
  const queryClient = useQueryClient();
  const userId = user?.user_id ? Number(user.user_id) : undefined;
  
  // Default options
  const { 
    limit = 10, 
    page = 1, 
    enabled = !!userId 
  } = options || {};

  // Query key for notifications
  const notificationsKey = ['notifications', userId, limit, page];

  // Fetch notifications query
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: notificationsKey,
    queryFn: () => {
      if (!userId) return { notifications: [], total: 0 };
      return notificationService.getNotifications(userId, limit, page);
    },
    enabled: enabled,
  });

  // Mark notification as read mutation
  const {
    mutateAsync: markAsRead,
    isPending: isMarkingAsRead,
  } = useMutation({
    mutationFn: (notificationId: number) => {
      return notificationService.markAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  // Delete notification mutation
  const {
    mutateAsync: deleteNotification,
    isPending: isDeletingNotification,
  } = useMutation({
    mutationFn: (notificationId: number) => {
      return notificationService.deleteNotification(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  // Delete all notifications mutation
  const {
    mutateAsync: deleteAllNotifications,
    isPending: isDeletingAllNotifications,
  } = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('User ID is required');
      return notificationService.deleteAllNotifications(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  // Extract the data
  const notifications = notificationsData?.notifications || [];
  const totalNotifications = notificationsData?.total || 0;
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    // Queries
    notifications,
    totalNotifications,
    unreadCount,
    isLoadingNotifications,
    notificationsError,
    refetchNotifications,
    
    // Mutations
    markAsRead,
    isMarkingAsRead,
    deleteNotification,
    isDeletingNotification,
    deleteAllNotifications,
    isDeletingAllNotifications,
  };
}; 