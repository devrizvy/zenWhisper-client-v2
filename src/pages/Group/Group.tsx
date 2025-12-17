import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Room from './Room';
import RoomChat from './RoomChat';

const Group: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Room />} />
      <Route path="/:id" element={<RoomChat />} />
    </Routes>
  );
};

export default Group;