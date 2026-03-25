import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [...prev, notification]);
      toast.info(notification.message);
    });

    return () => socket.off();
  }, []);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.map((note, index) => (
        <p key={index} className={`notification ${note.type}`}>
          {note.message}
        </p>
      ))}
    </div>
  );
};

export default Notifications;
