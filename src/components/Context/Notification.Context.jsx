import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import toast, { Toaster } from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Create the connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5201/notificationHub?email=admin@marketplace.com")
      .withAutomaticReconnect()
      .build();

    // Start the connection
    async function startConnection() {
      try {
        await newConnection.start();
        console.log("SignalR Connected!");
        setConnection(newConnection);
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setTimeout(startConnection, 5000);
      }
    }

    // Set up event handler
    newConnection.on("ReceiveNotification", (type, message) => {
      // Add to notifications array
      setNotifications(prev => [...prev, { type, message, timestamp: new Date() }]);
      
      // Show toast
      toast(message, {
        icon: '🔔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    });

    // Start the connection
    startConnection();

    // Clean up on unmount
    return () => {
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        newConnection.stop();
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      <Toaster position="top-right" />
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use the notification context
export function useNotifications() {
  return useContext(NotificationContext);
}