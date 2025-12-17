import { useState, useEffect } from 'react';
import { ArrowLeft, Search, MessageCircle, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useUsers from '../../hooks/useUsers';

const UsersList = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Use TanStack Query for users
  const { data: users, refetch, isLoading, error } = useUsers();

  const handleUserSelect = (selectedUser: any) => {
    navigate(`/chat/${selectedUser.email}`, {
      state: {
        partnerUsername: selectedUser.username,
        partnerEmail: selectedUser.email
      }
    });
  };

  // Filter out current user from the list
  const filteredUsers = users.filter(u => u.email !== user?.email);

  // Further filter by search query
  const searchFilteredUsers = filteredUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/chat')}
              className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 rounded-lg transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-sidebar-foreground">Find People</h2>
              <p className="text-xs text-sidebar-foreground/60">Connect with new people</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-sidebar-accent/50 border border-sidebar-border rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-400 mb-4">Failed to load users</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : searchFilteredUsers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <UserCircle className="w-16 h-16 mx-auto mb-4 text-sidebar-foreground/30" />
                <h3 className="text-lg font-medium text-sidebar-foreground mb-2">
                  {searchQuery ? 'No users found' : isLoading ? 'Loading...' : 'No other users available'}
                </h3>
                <p className="text-sm text-sidebar-foreground/60">
                  {searchQuery ? 'Try different search terms' : 'Check back later for more users'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-w-2xl mx-auto">
              {searchFilteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className="p-4 bg-sidebar-accent/30 hover:bg-sidebar-accent/50 border border-sidebar-border/50 hover:border-primary/30 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-sidebar-border">
                        <span className="text-lg font-semibold text-primary">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sidebar-foreground truncate">
                          {user.username}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-sidebar-accent text-sidebar-foreground/60">
                          Available
                        </span>
                      </div>
                      <p className="text-sm text-sidebar-foreground/60 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 text-primary/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-all group-hover:opacity-100 opacity-0">
                        <MessageCircle size={18} />
                      </button>
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

export default UsersList;