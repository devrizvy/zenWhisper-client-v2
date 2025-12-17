import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatList from './ChatList';
import ChatFeed from './ChatFeed';
import UsersList from './UsersList';

const Chats: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatList />} />
      <Route path="/users" element={<UsersList />} />
      <Route path="/:id" element={<ChatFeed />} />
    </Routes>
  );
};

export default Chats;