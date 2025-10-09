import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationList = ({ onClose }) => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'trip_request':
        return '🚗';
      case 'trip_cancelled':
        return '❌';
      case 'trip_completed':
        return '✅';
      case 'new_message':
        return '💬';
      case 'new_review':
        return '⭐';
      case 'badge_earned':
        return '🏆';
      case 'level_up':
        return '🎉';
      case 'sos_alert':
        return '🚨';
      default:
        return '📢';
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="notification-list">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Notificaciones
          {unreadCount > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({unreadCount} sin leer)
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: es
                    })}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Unread Indicator */}
              {!notification.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
