/**
 * Shared URL contract for coordinating organizer race route composition
 * between the page (tab navigation) and features that must know whether
 * they are on the currently visible tab (e.g. join-requests keeps its
 * SignalR connection alive across tabs, but only shows UI when active).
 */
export const ORGANIZER_RACE_TAB_PARAM = 'tab'
export const ORGANIZER_RACE_REQUESTS_TAB = 'requests'
export const ORGANIZER_RACE_MENU_TAB = 'menu'
export const ORGANIZER_RACE_ANNOUNCEMENT_HISTORY_TAB = 'announcement-history'
