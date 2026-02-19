import db from '../config/database.js';

export const getChatRooms = async (req, res, next) => {
  try {
    const rooms = await db('chat_rooms')
      .select('*')
      .orderBy('created_at', 'desc');

    res.json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const messages = await db('chat_messages')
      .where({ room_id: roomId })
      .join('users', 'chat_messages.user_id', 'users.id')
      .select(
        'chat_messages.*',
        'users.username',
        'users.avatar'
      )
      .orderBy('chat_messages.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: { messages: messages.reverse() }
    });
  } catch (error) {
    next(error);
  }
};
