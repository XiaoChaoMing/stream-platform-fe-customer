import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Settings,
  Trash2,
  Check,
  ChevronUp,
  ChevronDown,
  Loader2
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationQuery } from "@/hooks/useNotificationQuery";
import { useNotificationStore } from "@/store/notificationStore";
import { useStore } from "@/store/useStore";

export interface NotificationItem {
  notification_id: number,
  user_id: number,
  sender_id: number,
  type_id: number,
  message: string,
  is_read: boolean,
  created_at: string,
  sender: {
    username: string,
    avatar: string
  }
}

interface NotificationDropdownProps {
  trigger: React.ReactNode;
  limit?: number;
}

const NotificationDropdown = memo(({
  trigger,
  limit = 6
}: NotificationDropdownProps) => {
  const { user } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Notification query with pagination
  const {
    notifications: apiNotifications,
    isLoadingNotifications,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    refetchNotifications,
    totalNotifications
  } = useNotificationQuery({ 
    limit: expanded ? 20 : limit, 
    page 
  });

  const {
    notifications,
    setNotifications,
    markAsRead: markLocalAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
  } = useNotificationStore();

  // Sync notifications from API to local store
  useEffect(() => {
    if (apiNotifications && apiNotifications.length > 0) {
      if (page === 1) {
        // Replace notifications if it's the first page
        setNotifications(apiNotifications);
      } else {
        // Append notifications for pagination
        const existingIds = new Set(notifications.map(n => n.notification_id));
        const newNotifications = [
          ...notifications,
          ...apiNotifications.filter(n => !existingIds.has(n.notification_id))
        ];
        setNotifications(newNotifications);
      }
      setIsLoadingMore(false);
    }
  }, [apiNotifications, setNotifications, page, notifications]);

  // Handle scroll to implement infinite scrolling
  const handleScroll = () => {
    if (!scrollContainerRef.current || !expanded) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrollPosition = scrollTop + clientHeight;
    
    // If we're near the bottom and there are more notifications to load
    if (
      scrollPosition >= scrollHeight - 50 && 
      !isLoadingMore && 
      notifications.length < totalNotifications
    ) {
      setIsLoadingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [expanded, notifications.length, totalNotifications]);

  // Handle toggling expanded view
  const handleToggleExpanded = () => {
    setExpanded(!expanded);
    
    // Reset to page 1 when collapsing
    if (expanded) {
      setPage(1);
    }
  };

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      // Update local state immediately for better UX
      markLocalAsRead(notificationId);
      
      // Then update on the server
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Could refresh to restore state if needed
      refetchNotifications();
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // Update local state immediately
      markAllAsRead();
      
      // If we had a backend endpoint for marking all as read, we would call it here
      // For now, let's mark each notification as read
      for (const notification of notifications.filter(n => !n.is_read)) {
        await markAsRead(notification.notification_id);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      refetchNotifications();
    }
  };

  // Handle deleting a notification
  const handleDeleteNotification = async (notificationId: number) => {
    try {
      // Update local state immediately
      removeNotification(notificationId);
      
      // Then delete on the server
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      refetchNotifications();
    }
  };

  // Handle clearing all notifications
  const handleClearAllNotifications = async () => {
    if (!user?.user_id) return;
    
    try {
      // Update local state immediately
      clearNotifications();
      
      // Then delete all on the server
      await deleteAllNotifications();
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
      refetchNotifications();
    }
  };

  // Helper function to get avatar fallback safely
  const getAvatarFallback = (notification: NotificationItem) => {
    if (!notification.sender.username) return '?';
    return notification.sender.username.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-96 z-99" 
        align="end"
        onCloseAutoFocus={() => {
          // Reset to collapsed view when dropdown closes
          setExpanded(false);
          setPage(1);
        }}
      >
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications {totalNotifications > 0 && `(${notifications.length}/${totalNotifications})`}</span>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleMarkAllAsRead} 
              title="Mark all as read"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleClearAllNotifications} 
              title="Clear all notifications"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              title="Notification settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Notification Items */}
        <div 
          ref={scrollContainerRef} 
          className={`overflow-y-auto transition-all duration-300 ${expanded ? 'max-h-[80vh]' : 'max-h-[350px]'}`}
          onScroll={handleScroll}
        >
          {isLoadingNotifications && page === 1 ? (
            <div className="py-4 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.notification_id} 
                  className={`flex p-3 cursor-pointer ${!notification.is_read ? 'bg-accent/30' : ''}`}
                  onSelect={(e) => {
                    // Prevent default selection behavior
                    e.preventDefault();
                    // Mark as read if not already read
                    if (!notification.is_read) {
                      handleMarkAsRead(notification.notification_id);
                    }
                  }}
                >
                  <div className="flex gap-3 w-full">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={notification.sender.avatar} />
                      <AvatarFallback>{getAvatarFallback(notification)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-sm">{notification.sender.username || 'Notification'}</span>
                        <span className="text-xs text-muted-foreground flex items-center ml-2 flex-shrink-0">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.created_at || 'Just now'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message || 'No message content'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.notification_id);
                          }}
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.notification_id);
                        }}
                        title="Delete notification"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              
              {/* Loading indicator for infinite scroll */}
              {isLoadingMore && (
                <div className="py-2 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              )}
              
              {/* End of notifications message */}
              {!isLoadingMore && notifications.length >= totalNotifications && totalNotifications > 0 && (
                <div className="py-2 text-center text-xs text-muted-foreground">
                  You've reached the end of notifications
                </div>
              )}
            </>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        <div className="flex justify-center items-center py-2 cursor-pointer hover:bg-accent" onClick={handleToggleExpanded}>
          {expanded ? (
            <div className="flex items-center">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-semibold">Show less</span>
            </div>
          ) : (
            <div className="flex items-center">
              <ChevronDown className="h-4 w-4 mr-1" />
              <span className="text-sm font-semibold">View all notifications</span>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

NotificationDropdown.displayName = "NotificationDropdown";

export default NotificationDropdown; 