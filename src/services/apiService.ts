// HTTP API Service for zenWhisper backend

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Backend message types (matching your MongoDB schema)
export interface BackendPrivateMessage {
  _id: string;
  chatId: string;
  senderEmail: string;
  senderUsername: string;
  receiverEmail: string;
  receiverUsername: string;
  message: string;
  time: string;
  createdAt: string; // ISO date string
}

export interface BackendRoomMessage {
  _id: string;
  roomId: string;
  room: string;
  author: string;
  message: string;
  time: string;
  createdAt: string; // ISO date string
}

export interface BackendChat {
  chatId: string;
  partnerEmail: string;
  partnerUsername: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageDate: string;
}

// Generic API request wrapper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (username: string, email: string, password: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  logout: async (email: string) => {
    return apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Get all users (for testing/debugging)
  getUsers: async () => {
    return apiRequest('/auth/users');
  },
};

// Messages API
export const messagesApi = {
  // Get room messages for a specific room
  getRoomMessages: async (roomId: string) => {
    return apiRequest(`/messages/room/${roomId}`);
  },

  // Get private messages for a specific chat
  getPrivateMessages: async (chatId: string) => {
    return apiRequest(`/messages/private-chat/${chatId}`);
  },

  // Get all chats for a specific user
  getUserChats: async (userEmail: string) => {
    return apiRequest(`/messages/user-chats/${userEmail}`);
  },
};

// Utility functions
export const generateChatId = (email1: string, email2: string): string => {
  // Create a consistent chat ID regardless of email order
  const sortedEmails = [email1, email2].sort();
  return btoa(sortedEmails.join('_')).replace(/[/+=]/g, '');
};

export const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = Math.abs(today.getTime() - messageDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

export default apiRequest;