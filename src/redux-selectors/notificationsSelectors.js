export const selectNotifications = (state) => state.notifications.notifications;
export const selectNotificationsLoading = (state) => state.notifications.loading;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectActiveFilter = (state) => state.notifications.activeFilter;
export const selectSearchTerm = (state) => state.notifications.searchTerm;
export const selectShowSettings = (state) => state.notifications.showSettings;
export const selectShowMobileFilters = (state) => state.notifications.showMobileFilters;
export const selectNotificationSettings = (state) => state.notifications.notificationSettings;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

export const selectFilteredNotifications = (state) => {
  const notifications = selectNotifications(state);
  const activeFilter = selectActiveFilter(state);
  const searchTerm = selectSearchTerm(state);
  
  return notifications.filter(notification => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'unread' && !notification.read) ||
      notification.type === activeFilter;
    
    const matchesSearch = searchTerm === '' || 
      notification.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
};

export const selectFilterCounts = (state) => {
  const notifications = selectNotifications(state);
  const unreadCount = selectUnreadCount(state);
  
  return {
    all: notifications.length,
    unread: unreadCount,
    connection: notifications.filter(n => n.type === 'connection').length,
    reaction: notifications.filter(n => n.type === 'reaction').length,
    message: notifications.filter(n => n.type === 'message').length,
    mention: notifications.filter(n => n.type === 'mention').length,
    job: notifications.filter(n => n.type === 'job').length,
    recommendation: notifications.filter(n => n.type === 'recommendation').length
  };
};

export const selectFilters = (state) => {
  const counts = selectFilterCounts(state);
  
  return [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'unread', label: 'Unread', count: counts.unread },
    { id: 'connection', label: 'Connections', count: counts.connection },
    { id: 'reaction', label: 'Reactions', count: counts.reaction },
    { id: 'message', label: 'Messages', count: counts.message },
    { id: 'mention', label: 'Mentions', count: counts.mention },
    { id: 'job', label: 'Jobs', count: counts.job },
    { id: 'recommendation', label: 'Recommendations', count: counts.recommendation }
  ];
};