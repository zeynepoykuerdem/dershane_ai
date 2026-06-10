"use client";
import CalendarComponent from "./ui/calendar_update";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type ChartItem = {
  subject: string;
  percentage: number;
  color_rank: string;
};

export default function PerformanceChart({
  showCalendar,
  studentId,
  
}: {
  showCalendar: boolean;
  studentId?: string;
  
}) {
  const [examData, setExamData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  

  useEffect(() => {
    if (studentId) fetchExams();
  }, [studentId]);

  const fetchExams = async () => {
    console.log("fetchExams cagirildi,studentId:", studentId);
    const { data, error } = await supabase
      .from("exams")
      .select("id,subject,score,max_score,created_at,grades_source") // id= unique key best practcie icin cekmek cok önemli
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    console.log("data:", data);
    console.log("error:", error);

    if (data) {
      setExamData(data);
    }

    const grouped: Record<string, number[]> = {}; // Dict:dersleri gruplandiriyorum

    data?.forEach((exam) => {
      if (!grouped[exam.subject]) grouped[exam.subject] = [];
      grouped[exam.subject].push((exam.score / exam.max_score) * 100); // queue veya stack gibi mi
      console.log(grouped[0]);
    });

    const averages = Object.entries(grouped).map(([subject, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const percentage = Math.round(avg);
      const color_rank =
        avg >= 80 ? "bg-green-400" : avg >= 60 ? "bg-yellow-400" : "bg-red-400";
      return { subject, percentage, color_rank };
    });

    setChartData(averages);
  };

  return (
    <div className="col-span-2 bg-white rounded-xl border p-4 overflow-y-auto">
      {showCalendar ? (
        <CalendarComponent />
      ) : (
        <>
          <h2 className="font-semibold text-gray-700 mb-4">
            Performans Analizi
          </h2>
          <div className="flex flex-col gap-3">
            {chartData.map((item) => (
              <div key={item.subject} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 truncate">
                  {item.subject}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className={`${item.color_rank} h-3 rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-10">
                  %{item.percentage}
                </span>
              </div>
            ))}
          </div>

          {/* Son Sınavlar */}
          <h3 className="font-semibold text-gray-700 mt-6 mb-3">
            Son Sınavlar
          </h3>
          <div className="flex flex-col gap-2">
            {examData.slice(0, 5).map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2"
              >
                <span>{exam.subject}</span>
                <span>{exam.grades_source}</span>
                <span
                  className={`text-sm font-bold ${
                    (exam.score / exam.max_score) * 100 >= 80
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {" "}
                  %{Math.round((exam.score / exam.max_score) * 100)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
