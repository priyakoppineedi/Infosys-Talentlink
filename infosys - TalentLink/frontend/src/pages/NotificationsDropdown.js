// NotificationsDropdown.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/notifications/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    fetchNotifs();
    // optionally set interval polling every X seconds
    const interval = setInterval(fetchNotifs, 10000); 
    return () => clearInterval(interval);
  }, [token]);

  const handleClick = (notif) => {
    // mark as read
    api.patch(`/notifications/${notif.id}/`, { unread: false }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => console.error(err));
    // navigate to target
    if (notif.target_type === 'Message') {
      navigate(`/messages/${notif.actor}`);  // or other logic
    } else if (notif.target_type === 'Contract') {
      navigate(`/contracts`);
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div>
      <button>Notifications ({unreadCount})</button>
      <div style={{ position: 'absolute', background: 'white', border: '1px solid #ccc' }}>
        {notifications.map(n => (
          <div key={n.id} onClick={() => handleClick(n)} style={{ background: n.unread ? '#eef' : '#fff', padding: '0.5rem' }}>
            <strong>{n.actor_name}</strong> {n.verb}
            <br />
            <small>{new Date(n.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
