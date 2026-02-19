import jwt from 'jsonwebtoken';
import db from '../config/database.js';

export const initializeSocket = (io) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Token manquant'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Utilisateur connecté: ${socket.userId}`);

    // Join room
    socket.on('room:join', async (roomId) => {
      socket.join(roomId);
      socket.currentRoom = roomId;
      console.log(`📥 Utilisateur ${socket.userId} a rejoint la room ${roomId}`);

      // Notify others
      socket.to(roomId).emit('user:joined', {
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // Leave room
    socket.on('room:leave', (roomId) => {
      socket.leave(roomId);
      console.log(`📤 Utilisateur ${socket.userId} a quitté la room ${roomId}`);

      socket.to(roomId).emit('user:left', {
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // Send message
    socket.on('message:send', async (data) => {
      try {
        const { roomId, content } = data;
        console.log('📨 Message reçu:', { roomId, content, userId: socket.userId });

        if (!roomId || !content) {
          console.error('❌ Données manquantes:', data);
          return socket.emit('error', { message: 'roomId ou content manquant' });
        }

        // Save message to database
        const [messageId] = await db('chat_messages').insert({
          room_id: roomId,
          user_id: socket.userId,
          content: content,
          created_at: db.fn.now()
        });

        // Get user info
        const user = await db('users')
          .where({ id: socket.userId })
          .select('username', 'codm_username')
          .first();

        const message = {
          id: messageId,
          room_id: roomId,
          user_id: socket.userId,
          username: user.username,
          content: content,
          created_at: new Date()
        };

        console.log('✅ Message envoyé à la room:', roomId, message);

        // Broadcast to room (including sender)
        io.to(roomId).emit('message:receive', message);
      } catch (error) {
        console.error('❌ Erreur envoi message:', error);
        socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });

    // Typing indicator
    socket.on('user:typing', async (data) => {
      const { roomId } = data;
      const user = await db('users')
        .where({ id: socket.userId })
        .select('username')
        .first();
        
      socket.to(roomId).emit('user:typing', {
        userId: socket.userId,
        username: user?.username || 'Utilisateur',
        timestamp: new Date()
      });
    });

    socket.on('user:stop-typing', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('user:stop-typing', {
        userId: socket.userId
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Utilisateur déconnecté: ${socket.userId}`);
      
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('user:left', {
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });
  });

  console.log('🔌 Socket.io initialisé avec succès');
};
