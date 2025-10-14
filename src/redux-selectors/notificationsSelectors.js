import { createSelector } from "reselect";

const selectNotificationsState = (state) => state.notifications || [];

export const selectNotifications = createSelector(
  [selectNotificationsState],
  (state) => state.notifications || []
);

export const selectNotificationsLoading = createSelector(
  [selectNotificationsState],
  (state) => state.loading || false
);

export const selectNotificationsError = createSelector(
  [selectNotificationsState],
  (state) => state.error || null
);

export const selectActiveFilter = createSelector(
  [selectNotificationsState],
  (state) => state.activeFilter || "all"
);

export const selectSearchTerm = createSelector(
  [selectNotificationsState],
  (state) => state.searchTerm || ""
);

export const selectShowSettings = createSelector(
  [selectNotificationsState],
  (state) => state.showSettings || false
);

export const selectShowMobileFilters = createSelector(
  [selectNotificationsState],
  (state) => state.showMobileFilters || false
);

export const selectNotificationSettings = createSelector(
  [selectNotificationsState],
  (state) => state.notificationSettings || {}
);

export const selectUnreadCount = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter((n) => !n.read).length
);

export const selectFilteredNotifications = createSelector(
  [selectNotifications, selectActiveFilter, selectSearchTerm],
  (notifications, activeFilter, searchTerm) => {
    return (notifications || []).filter((n) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "unread" && !n.read) ||
        n.type === activeFilter;

      const matchesSearch =
        !searchTerm ||
        (n.senderName && n.senderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (n.message && n.message.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }
);

export const selectFilterCounts = createSelector(
  [selectNotifications, selectUnreadCount],
  (notifications, unreadCount) => {
    const safeNotifications = notifications || [];
    return {
      all: safeNotifications.length,
      unread: unreadCount,
      connection: safeNotifications.filter((n) => n.type === "connection").length,
      reaction: safeNotifications.filter((n) => n.type === "reaction").length,
      message: safeNotifications.filter((n) => n.type === "message").length,
      mention: safeNotifications.filter((n) => n.type === "mention").length,
      job: safeNotifications.filter((n) => n.type === "job").length,
      recommendation: safeNotifications.filter((n) => n.type === "recommendation").length,
    };
  }
);

export const selectFilters = createSelector([selectFilterCounts], (counts) => [
  { id: "all", label: "All", count: counts.all },
  { id: "unread", label: "Unread", count: counts.unread },
  { id: "connection", label: "Connections", count: counts.connection },
  { id: "reaction", label: "Reactions", count: counts.reaction },
  { id: "message", label: "Messages", count: counts.message },
  { id: "mention", label: "Mentions", count: counts.mention },
  { id: "job", label: "Jobs", count: counts.job },
  { id: "recommendation", label: "Recommendations", count: counts.recommendation },
]);
