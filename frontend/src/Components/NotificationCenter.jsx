import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const selectedProject = useSelector(state => state.project.selectedProject);

  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'warning',
        icon: 'fas fa-exclamation-triangle',
        title: 'Attendance Pending',
        message: '5 workers pending attendance for today',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'info',
        icon: 'fas fa-boxes',
        title: 'Low Stock Alert',
        message: 'Cement stock running low in current project',
        time: '4 hours ago'
      },
      {
        id: 3,
        type: 'success',
        icon: 'fas fa-check-circle',
        title: 'Payroll Processed',
        message: 'Monthly payroll processed for 12 workers',
        time: '1 day ago'
      }
    ];
    setNotifications(mockNotifications);
  }, [selectedProject]);

  const getNotificationClass = (type) => {
    const classes = {
      warning: 'notification-warning',
      info: 'notification-info',
      success: 'notification-success',
      error: 'notification-error'
    };
    return classes[type] || 'notification-info';
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-center">
      <div className="container">
        <div className="notifications-header">
          <h6 className="notifications-title">
            <i className="fas fa-bell me-2"></i>
            Recent Updates
          </h6>
        </div>
        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification-item ${getNotificationClass(notification.type)}`}>
              <div className="notification-icon">
                <i className={notification.icon}></i>
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{notification.time}</div>
              </div>
              <button className="notification-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;