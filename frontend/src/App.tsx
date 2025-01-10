import Home from "./Home";
import ChatInterface from "./components/ChatInterface";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </>
  );
}

export default App;
