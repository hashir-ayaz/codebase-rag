import ChatInterface from "@/components/ChatInterface";
import Footer from "@/components/footer";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800">
        <br />
        <ChatInterface />
        <Footer/>
    </div>
  );
}
