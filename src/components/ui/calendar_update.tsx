"use client";

import { useState, useEffect } from "react";

import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";

interface CalendarEvent {
  date: string;
  title:string |null;
  subject: string;
  topic: string |null;
  startTime: string | null;
  endTime: string | null;
  type: "exam" | "course" |"hw";
}
/**
 * 
 *  title:string,
    subject:string,
    dueDate:string,
    description:string,
    student_id:string
 */

export default function CalendarComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const selectedDateStr = date
  ? `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
  : ''

  const [courses, setCourses] = useState<CalendarEvent[]>([]);
  const [exams, setExams] = useState<CalendarEvent[]>([]);
  const [homeworks, setHomeworks] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    console.log('exams:',exams)
    console.log('courses:',courses)
    console.log('selectedDateStr:',selectedDateStr)
    handleExamRead();
    handleCourseRead();
    handleHomeworkRead();
  }, []);

  const handleHomeworkRead = async () =>{
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("homework")
      .select("*")
      .eq("student_id", user?.id)
      .order("created_at", { ascending: false });
    if (data) {
      const homeworkEvents = data.map((hw: any) => ({
        date: hw.due_date,
        title: hw.title,
        subject: hw.subject,
        topic: null,
        startTime: null,
        endTime: null,
        type: "hw" as const,
      }));
      setHomeworks(homeworkEvents);
    }
    if (error) console.error("Hata olustu:", error);

  }

  const handleExamRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("student_id", user?.id)
      .order("created_at", { ascending: false });
    if (data) {
      const examEvents = data.map((exam: any) => ({
        date: exam.exam_date,
        title: null,
        subject: exam.subject,
        topic: exam.topic,
        startTime: null,
        endTime: null,
        type: "exam" as const,
      }));
      setExams(examEvents);
    }
    if (error) console.error("Hata olustu:", error);
  };
 
  const handleCourseRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("course")
      .select("*")
      .eq("student_id", user?.id)
      .order("created_at", { ascending: false });
    if (data) {
      const courseEvents = data.map((course: any) => ({
        date: course.course_date,
        title: course.title,
        subject: course.subject,
        topic: course.topic,
        startTime: course.start_hour?.slice(0,5) ?? null,
        endTime: course.end_hour?.slice(0,5)?? null,
        type: "course" as const,
      }));
      setCourses(courseEvents);
    }
    if (error) console.error("Hata olustu:", error);
  };
  const todaysEvents = [
    ...exams
      .filter((e) => e.date === selectedDateStr)
      .map((e) => ({
        date: e.date,
        subject: e.subject,
        topic: e.topic,
        startTime: null,
        endTime: null,
        type: e.type,
        title: e.title,
      })),
    ...courses
      .filter((c) => c.date === selectedDateStr)
      .map((c) => ({
        date: c.date,
        subject: c.subject,
        topic: c.topic,
        startTime: null,
        endTime: null,
        type: c.type,
        title: c.title,
      })),
    ...homeworks
      .filter((h) => h.date === selectedDateStr)
      .map((h) => ({
        date: h.date,
        subject: h.subject,
        topic: h.topic,
        startTime: null,
        endTime: null,
        type: h.type,
        title: h.title,
      })),
  ];

  return (
    <div className="flex flex-col gap-4 ">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border w-full [&_table]:w-full [&_td]:w-full [&_th]:w-full"
        captionLayout="dropdown"
      />
      <div className=" rounded-lg border w-full p-4">
        <h3 className="font-medium text-gray-700 mb-3">
          {date?.toLocaleDateString("tr-TR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        {todaysEvents.length === 0 ? (
          <p className="text-sm text-gray-400">
            {" "}
            Bu gün için etkinlik bulunmamaktadır.
          </p>
        ) : (
          todaysEvents.map((event, index) => (
            <div key={index} className="mb-2 p-2 bg-white rounded shadow">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    event.type === "exam"
                      ? "bg-red-100 text-red-700"
                      : event.type === "course"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {event.type === "exam"
                    ? "Sınav"
                    : event.type === "course"
                    ? "Ders"
                    : "Ödev"}
                </span>
                <div className="ml-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {event.type === 'exam' ? event.subject : event.title}
                  </p>
                  <p className="text-xs text-gray-500">{event.topic}</p>
                  {event.startTime && event.endTime && (
                    <p className="text-xs text-gray-500">
                      {event.startTime} - {event.endTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
