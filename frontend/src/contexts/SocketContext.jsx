import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connecté');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket déconnecté');
      setConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('Erreur Socket:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  const joinRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('room:join', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('room:leave', roomId);
    }
  };

  const sendMessage = (roomId, content) => {
    if (socket && connected) {
      console.log('📤 Envoi message:', { roomId, content });
      socket.emit('message:send', { roomId, content });
    } else {
      console.error('❌ Socket non connecté ou roomId manquant');
    }
  };

  const value = {
    socket,
    connected,
    joinRoom,
    leaveRoom,
    sendMessage,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket doit être utilisé dans un SocketProvider');
  }
  return context;
};
