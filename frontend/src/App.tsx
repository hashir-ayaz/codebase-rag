import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Home from "@/pages/Home";
import ChatPage from "@/pages/ChatPage";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
  );
}
