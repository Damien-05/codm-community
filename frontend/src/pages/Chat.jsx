import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatService } from '../services/tournament.service';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Send, Hash, Users, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Chat() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket, connected, joinRoom, leaveRoom, sendMessage } = useSocket();
  const { user, isAuthenticated } = useAuth();

  // Charger les rooms disponibles
  const { data: roomsData, isLoading: roomsLoading, error: roomsError } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: chatService.getRooms,
    enabled: isAuthenticated,
    staleTime: 60000, // Cache de 1 minute
    cacheTime: 300000,
  });

  const rooms = roomsData?.data?.rooms || [];

  // Charger les messages de la room sélectionnée
  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ['chat-messages', selectedRoom?.id],
    queryFn: () => chatService.getMessages(selectedRoom.id),
    enabled: !!selectedRoom,
  });

  // Initialiser les messages depuis l'API
  useEffect(() => {
    if (messagesData?.data?.messages) {
      setMessages(messagesData.data.messages);
    }
  }, [messagesData]);

  // Joindre une room via Socket.io
  useEffect(() => {
    if (selectedRoom && socket && connected) {
      joinRoom(selectedRoom.id);
      refetchMessages();

      // Écouter les nouveaux messages
      socket.on('message:receive', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Écouter les indicateurs de frappe
      socket.on('user:typing', ({ userId, username }) => {
        setTypingUsers((prev) => {
          if (!prev.find((u) => u.userId === userId)) {
            return [...prev, { userId, username }];
          }
          return prev;
        });
      });

      socket.on('user:stop-typing', ({ userId }) => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
      });

      return () => {
        leaveRoom(selectedRoom.id);
        socket.off('message:receive');
        socket.off('user:typing');
        socket.off('user:stop-typing');
      };
    }
  }, [selectedRoom, socket, connected]);

  // Auto-scroll vers le bas quand nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedRoom) return;

    sendMessage(selectedRoom.id, messageInput);
    setMessageInput('');
    
    // Arrêter l'indicateur de frappe
    if (socket) {
      socket.emit('user:stop-typing', { roomId: selectedRoom.id });
    }
  };

  const handleTyping = () => {
    if (!socket || !selectedRoom) return;

    // Émettre "en train de taper"
    socket.emit('user:typing', { roomId: selectedRoom.id });

    // Annuler l'indicateur après 2 secondes d'inactivité
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('user:stop-typing', { roomId: selectedRoom.id });
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Connectez-vous pour accéder au chat</p>
      </div>
    );
  }

  if (roomsLoading) {
    return (
      <div className="min-h-[400px]">
        <LoadingSpinner size="lg" text="Chargement des channels..." />
      </div>
    );
  }

  if (roomsError) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorMessage 
          message="Erreur lors du chargement des channels de chat"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      {/* Sidebar - Liste des rooms */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 card flex-shrink-0 overflow-y-auto"
      >
        <h2 className="text-xl font-bold font-orbitron text-cod-orange mb-4 flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Channels
        </h2>
        <div className="space-y-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedRoom?.id === room.id
                  ? 'bg-cod-orange text-black font-semibold'
                  : 'bg-cod-dark hover:bg-cod-darkGray text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span># {room.name}</span>
                {room.type === 'tournament' && (
                  <span className="text-xs px-2 py-1 bg-cod-gold/20 text-cod-gold rounded">
                    Tournoi
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Zone de messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 card flex flex-col"
      >
        {!selectedRoom ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p>Sélectionnez un channel pour commencer</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header du chat */}
            <div className="border-b border-cod-orange/20 pb-4 mb-4">
              <h2 className="text-2xl font-bold font-orbitron text-cod-orange flex items-center gap-2">
                <Hash className="h-6 w-6" />
                {selectedRoom.name}
              </h2>
              {!connected && (
                <p className="text-sm text-yellow-500 mt-2">⚠️ Connexion au chat...</p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.user_id === user?.id ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cod-orange/20 flex items-center justify-center text-cod-orange font-bold">
                    {msg.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  
                  {/* Message */}
                  <div className={`flex-1 max-w-[70%] ${
                    msg.user_id === user?.id ? 'text-right' : ''
                  }`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm text-cod-orange">
                        {msg.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(msg.created_at), 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-lg ${
                      msg.user_id === user?.id
                        ? 'bg-cod-orange text-black'
                        : 'bg-cod-darkGray text-gray-200'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Indicateur de frappe */}
              {typingUsers.length > 0 && (
                <div className="text-sm text-gray-400 italic">
                  {typingUsers.map((u) => u.username).join(', ')} {typingUsers.length > 1 ? 'sont' : 'est'} en train d'écrire...
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                placeholder="Entrez votre message..."
                className="input flex-1"
                disabled={!connected}
              />
              <button
                type="submit"
                disabled={!messageInput.trim() || !connected}
                className="btn-primary px-6 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
