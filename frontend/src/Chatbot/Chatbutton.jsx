import { useState } from "react";
import { Send, Mic } from "lucide-react"; // install lucide-react for icons
import Chat from "./chats";

function Chatbot() {
  const [open, setOpen] = useState(false);

  const handleChats = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-[350px] h-[450px] bg-white border border-black rounded-xl  flex flex-col">
          <div className="bg-red-500 text-white p-3 rounded-t-xl font-bold">
            Chatbot
          </div>
            <Chat/>
        </div>
      )}

      <button
        onClick={handleChats}
        className="bg-red-500 p-4 rounded-full text-white "
      >
        💬
      </button>
    </div>
  );
}

export default Chatbot;