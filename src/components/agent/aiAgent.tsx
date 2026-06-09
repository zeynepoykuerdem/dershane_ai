"use client";

import { useRef, useState } from "react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ExamData {
  subject: string;
  topic: string;
  score: number;
  max_score: number;
  exam_date: string;
  grades_source: string;
  file_url?: string;
}

export default function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        body: JSON.stringify({ question: input, student_id: user?.id }),
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

  const handleFileUpload = async (file: File) => {
    console.log("handleFileUpload started");
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user?.id)
      .single();

    console.log("Profile error:", profileError);
    console.log("Profile:", profile);

    const filePath = `${user?.id}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage //bucket
      .from("exam-files")
      .upload(filePath, file);

    if (error) {
      console.error("Dosya yükleme hatasi:", error);
      setLoading(false);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("exam-files").getPublicUrl(filePath);

    console.log("Full name:", profile?.full_name);

    await parseFileWithClaude(file, publicUrl, user?.id, profile?.full_name);
    setLoading(false);
  };

  const parseFileWithClaude = async (
    file: File,
    fileUrl: string,
    studentId: string | undefined,
    student_name: string | undefined,
  ) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = reject;
      reader.onload = async () => {
        console.log("parseFile koduna geldim mi?");
        try {
          const base64 = (reader.result as string).split(",")[1];
          const fileType = file.type;

          const res = await fetch("/api/parse-exam", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base64,
              fileType,
              fileUrl,
              studentId,
              student_name,
            }),
          });
          const data = await res.json();
          console.log("ParsedData:", data.exams);
          if (data.exams) {
            const examsArray = Array.isArray(data.exams)
              ? data.exams
              : [data.exams];

            const {
              data: { user },
            } = await supabase.auth.getUser();
            for (const exam of examsArray) {
              const { error } = await supabase.from("exams").insert({
                ...exam,
                kazanim_kodlari: exam.kazanim_kodlari ?? [],
                file_url: fileUrl,
                student_id: user?.id,
              });
              if (error) {
                console.error("Hata:", error);
              }
            }

            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);

            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `✓ ${examsArray.length} sinav kaydedildi: `,
              },
            ]);
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      };
    });
  };

  return (
    <div className="col-span-1 bg-white rounded-xl border p-4 flex flex-col h-full">
      <h2 className="font-semibold text-gray-700 mb-3">AI Agent</h2>
      {/** Chat Alani */}

      <div className=" flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg text-sm max-w-[80%]
          ${
            msg.role === "assistant"
              ? "bg-purple-100 text-purple-800"
              : "bg-white border text-gray-700 self-end"
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
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <Button
          onClick={() => 
            fileInputRef.current?.click()
          }
          className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          📎
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
        <Button
        onClick={sendMessage}
        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        →
      </Button>
      

      {loading && (
        <p className="text-sm text-purple-600 mt-3">Dosya analiz ediliyor...</p>
      )}
      {isSubmitted && (
        <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          ✓ Sınav başarıyla kaydedildi
        </div>
      )}

      
    </div>
    </div>
  );
}
