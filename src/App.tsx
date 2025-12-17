import { Route, Routes } from "react-router";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import Layout from "./Layout/MainLayout";
import Favorites from "./pages/Favorites/Favorites";
import Group from "./pages/Group/Group";
import Notes from "./pages/Notes/Notes";
import AISummary from "./pages/AISummary/AISummary";
import Chats from "./pages/Chats/Chats";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Layout routes */}
      <Route path="/" element={<Layout />}>
        <Route path="favorites" element={<Favorites />} />
        <Route path="chat/*" element={<Chats />} />
        <Route path="group/*" element={<Group />} />
        <Route path="notes" element={<Notes />} />
        <Route path="ai-summary" element={<AISummary />} />
      </Route>
    </Routes>
  );
}

export default App;
