import { useState, useEffect } from 'react';
import { Search, MessageCircle, Users, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserChats } from '../../hooks/usePrivateMessages';

interface ChatUser {
  email: string;
  username: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  unreadCount?: number;
}

const ChatList = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Use TanStack Query for user chats
  const { isPending, chats, isError, error, refetch } = useUserChats(user?.email || '');

  // Transform backend chats to frontend format
  const chatUsers: ChatUser[] = chats.map((chat: any) => ({
    email: chat.partnerEmail,
    username: chat.partnerUsername,
    lastMessage: chat.lastMessage,
    lastMessageTime: chat.lastMessageTime,
    isOnline: false, // TODO: Implement real-time online status with socket
    isTyping: false, // TODO: Implement real-time typing status with socket
    unreadCount: 0, // TODO: Implement unread count logic
  }));

  const handleChatSelect = (chat: ChatUser) => {
    navigate(`/chat/${chat.email}`, {
      state: {
        partnerUsername: chat.username,
        partnerEmail: chat.email
      }
    });
  };

  const filteredUsers = chatUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary/60">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error Loading Chats</h2>
          <p className="text-red-400/60 mb-4">{error?.message || 'Failed to load chats'}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border/50 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/60 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-sidebar-foreground">Messages</h2>
                <p className="text-xs text-sidebar-foreground/60 font-light tracking-wide">Your conversations</p>
              </div>
            </div>

            {/* Users button */}
            <button
              onClick={() => navigate('/chat/users')}
              className="flex items-center gap-2 px-4 py-2 bg-sidebar-accent/50 hover:bg-sidebar-accent/70 border border-sidebar-border/50 hover:border-primary/30 rounded-xl transition-all group"
            >
              <Users className="w-4 h-4 text-sidebar-foreground/70 group-hover:text-primary" />
              <span className="text-sm text-sidebar-foreground/70 group-hover:text-sidebar-foreground">Find Users</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-sidebar-accent/50 border border-sidebar-border rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-sidebar-accent/50 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-sidebar-foreground/30" />
                </div>
                <h3 className="text-xl font-semibold text-sidebar-foreground mb-2">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </h3>
                <p className="text-sm text-sidebar-foreground/60 mb-4">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Start a new conversation to see it here'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => navigate('/chat/users')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Find Users to Chat With
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <div
                  key={user.email}
                  onClick={() => handleChatSelect(user)}
                  className="p-3 hover:bg-sidebar-accent/50 cursor-pointer transition-all group rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-sidebar-border">
                        <span className="text-sm font-semibold text-primary">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {user.isOnline && (
                        <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-400 fill-current" />
                      )}
                      {user.isTyping && (
                        <div className="absolute bottom-0 right-0 w-3 h-3">
                          <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-sidebar-foreground truncate">{user.username}</h3>
                        {user.lastMessageTime && (
                          <span className="text-xs text-sidebar-foreground/60 ml-2">{user.lastMessageTime}</span>
                        )}
                      </div>
                      <p className="text-sm text-sidebar-foreground/60 truncate mt-1">
                        {user.isTyping ? 'typing...' : user.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    {(user.unreadCount && user.unreadCount > 0) && (
                      <div className="w-6 h-6 bg-primary rounded-full text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {user.unreadCount}
                      </div>
                    )}

                    <div className="w-6 h-6 rounded-lg bg-sidebar-accent/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <MessageCircle className="w-3 h-3 text-sidebar-foreground/60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;