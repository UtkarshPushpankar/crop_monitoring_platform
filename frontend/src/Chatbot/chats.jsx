import React ,{useState} from 'react';
import { Send, Mic } from "lucide-react";
const PYTHON_URL = import.meta.env.VITE_PYTHON_URL;
import axios from 'axios';

const Chat = () => {
    const [messages,setmessages] = useState([]);
    const [query,setquery] = useState("");
    const [listening,setlistening] = useState(false);

    const handleSend = async()=>{
        try{
            const res =  await axios.post(`${PYTHON_URL}/chats`,{messages,query});
            const data = res.data;
            setmessages([...messages,{"query":query},{"answer":data}]);
            setquery("");
        }catch(err){
            console.log(err);
        }
    }

    const handleMic = () => {
        setlistening(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN"; 
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setquery(transcript); 
            setlistening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };
        // setlistening(false);
    }


    return (
        <div className=''>
            <div className="flex-1 p-3 h-[350px] overflow-y-auto flex flex-col gap-2">
                <div className="mb-2 p-2 bg-gray-200 rounded-lg w-fit">
                    👋 Hello! How can I help you?
                </div>
                {messages.map((msg,idx)=>(
                    msg.query ? (
                        <div key={idx} className="self-end mb-2 p-2 bg-blue-500 text-white rounded-lg w-fit">
                            {msg.query}
                        </div>
                    ) : (<div key={idx} className="self-start mb-2 p-2 bg-gray-200 rounded-lg w-fit">
                            {msg.answer}
                        </div>)
                ))}

               
            </div>
            <div className="p-2 border-t border-gray-300 flex items-center gap-2">
                <input
                    type="text"
                    placeholder={listening? "Listening....": "Type a message..."}
                    className="flex-1 border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    value = {query}
                    onChange = {(e)=>setquery(e.target.value)}
                />
                <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" onClick={handleSend}>
                    <Send size={18} />
                </button>
                <button className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300" onClick={handleMic}>
                    <Mic size={18} />
                </button>
            </div>
        </div>
    );
}

export default Chat;