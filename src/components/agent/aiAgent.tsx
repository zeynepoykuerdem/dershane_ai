"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, student_id: user?.id }),
      });
      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      const assistantMessage: Message = {
        role: "assistant",
        content: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }
  };

  return (
    <div className="col-span-1 bg-white rounded-xl border p-4 flex flex-col h-full">
      <h2 className="font-semibold text-gray-700 mb-3">AI Agent</h2>
      {/** Chat Alani */}

      <div className=" flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg,idx)=>(
          <div 
          key={idx} 
          className={`p-2 rounded-lg text-sm max-w-[80%]
          ${msg.role === "assistant" 
          ? "bg-purple-100 text-white" 
          : "bg-white-200 text-gray-700 self-end"
          }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
           <div className="bg-purple-100 rounded-lg p-2 text-xs text-purple-800">
            Analiz ediliyor...
          </div>
        )}
      </div>
      {/*** Input Alani */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e)=> setInput(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter" && !e.shiftKey){
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
          onClick={sendMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            →
          </button>
        </div>








    </div>
  )
}
