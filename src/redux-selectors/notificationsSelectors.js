export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectLoading = (state) => state.notifications.loading;
export const selectError = (state) => state.notifications.error;
export const selectFilter = (state) => state.notifications.filter;

export const selectFilteredNotifications = (state) => {
  const notifications = selectNotifications(state);
  const filter = selectFilter(state);
  
  switch (filter) {
    case 'unread':
      return notifications.filter(notification => !notification.isRead);
    case 'messages':
      return notifications.filter(notification => notification.type === 'message');
    case 'network':
      return notifications.filter(notification => 
        ['connection_request', 'connection_accepted'].includes(notification.type)
      );
    case 'jobs':
      return notifications.filter(notification => 
        ['job_match', 'application_update'].includes(notification.type)
      );
    default:
      return notifications;
  }
};

export const selectNotificationsByType = (state, type) => {
  const notifications = selectNotifications(state);
  return notifications.filter(notification => notification.type === type);
};