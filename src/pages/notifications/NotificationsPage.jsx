import React, { useEffect } from 'react';
import styles from './notification.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
   approveNotification,
   declineNotification,
} from '../../data/slices/notificationSlice';

// Utility function to get "time ago"
const getTimeAgo = (dateString) => {
  const now = new Date();
  const givenDate = new Date(dateString);
  const diffMs = now - givenDate;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hrs ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;

  return givenDate.toLocaleDateString();
};

const NotificationsTable = ({ title, data, onApprove, onDecline }) => {
  console.log(data,"jjfk")
  const showHeaders = !(title.includes('User') || title.includes('Agent Notifications'));

  return (
    <div className={styles.section}>
      <h2 className={styles.subtitle}>{title}</h2>
      <table className={styles.table}>
        {showHeaders && (
          <thead>
            <tr>
              <th>ID</th>
              <th>Name / Location</th>
              <th>Time</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{item.name || item.location || '-'}</td>
              <td>{getTimeAgo(item.created_at)}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>
  {(item.source === 'agent_working_location' || item.source === 'office_address' || item.source === 'agent') && (
    <div className={styles.actions}>
      <button
        className={styles.accept}
        onClick={() => onApprove(item.entity_id, item.source)}
      >
        Accept
      </button>
      <button
        className={styles.decline}
        onClick={() => onDecline(item.entity_id, item.source)}
      >
        Decline
      </button>
    </div>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const {
    users,
    agents,
    agentWorkingLocations,
    officeAddresses,
    loading,
    error,
  } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleApprove = (id, source) => {
     dispatch(approveNotification({ id, source })).then(() => {
      dispatch(fetchNotifications());
    });
  };

  const handleDecline = (id, source) => {
     dispatch(declineNotification({ id, source })).then(() => {
       dispatch(fetchNotifications());
     });
  };

  // Filter notifications
  const userNotifs = users || [];
  const agentNotifs = agents || [];

  const officeAddressNotifs = (officeAddresses || []).filter(
    (item) => item.status !== 'approved'
  );

  const agentWorkNotifs = (agentWorkingLocations || []).filter(
    (item) => item.is_approved !== true
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Notifications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching notifications: {error}</p>
      ) : (
        <>
          <NotificationsTable
            title="Office Address Notifications"
            data={officeAddressNotifs}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
          <NotificationsTable
            title="Agent Working Location Notifications"
            data={agentWorkNotifs}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
          {/* <NotificationsTable title="User Notifications" data={userNotifs} /> */}
          <NotificationsTable title="Agent Request" data={agentNotifs}   onApprove={handleApprove} onDecline={handleDecline}/>
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
