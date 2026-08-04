import { io } from 'socket.io-client';
import { BASE_URL } from '../api/axios';

let socket = null;

export function getGuestId() {
  let id = localStorage.getItem('jannat_guest_id');
  if (!id) {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('jannat_guest_id', id);
  }
  return id;
}

export function getSupportSocket() {
  return socket;
}

export function connectSupportSocket({ token, guestId, isAdmin = false } = {}) {
  if (socket?.connected) {
    if (isAdmin) socket.emit('join:admin');
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(BASE_URL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    auth: {
      token: token || undefined,
      guestId: guestId || undefined,
    },
    reconnection: true,
    reconnectionAttempts: 12,
    reconnectionDelay: 1200,
  });

  socket.on('connect', () => {
    if (isAdmin) socket.emit('join:admin');
  });

  return socket;
}

export function disconnectSupportSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinConversation(conversationId) {
  if (socket && conversationId) socket.emit('join:conversation', conversationId);
}

export function leaveConversation(conversationId) {
  if (socket && conversationId) socket.emit('leave:conversation', conversationId);
}
