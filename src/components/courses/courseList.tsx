"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { NavigationButton } from "@/components/ui/navigation_button";

const DAYS = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

const PALETTE = [
  { bg: "#EEEDFE", text: "#3C3489", border: "#AFA9EC" },
  { bg: "#E1F5EE", text: "#085041", border: "#5DCAA5" },
  { bg: "#FAEEDA", text: "#633806", border: "#EF9F27" },
  { bg: "#EAF3DE", text: "#27500A", border: "#97C459" },
  { bg: "#FAECE7", text: "#712B13", border: "#F0997B" },
  { bg: "#E6F1FB", text: "#0C447C", border: "#85B7EB" },
];

const getColor = (subject: string, subjects: string[]) => {
  const idx = subjects.indexOf(subject) % PALETTE.length;
  return PALETTE[idx];
};
const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  const jsDay = date.getDay();
  const map: Record<number, string> = {
    1: "Pazartesi",
    2: "Salı",
    3: "Çarşamba",
    4: "Perşembe",
    5: "Cuma",
    6: "Cumartesi",
    0: "Pazar",
  };
  return map[jsDay] ?? null;
};
{
  /** [18:05]:00  */
}
const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  return timeStr.slice(0, 5);
};
// ögrenci ödev listesi

export function CourseList() {
  // supabaseden sadece kendi ödevlerini cek
  // HomeworkCard componenti kullanarak listele
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + diffToMonday,
    );
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleChangePage = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => {
      const diff = direction === "next" ? 7 : -7;
      const newDate = new Date(
        prev.getFullYear(),
        prev.getMonth(),
        prev.getDate() + diff,
      );
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    });
  };
  const weekDates = DAYS.map((_, i) => {
    const date = new Date(currentWeek);
    date.setDate(currentWeek.getDate() + i);
    return date;
  });

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        fetchCourses(user.id);
      }
    };
    getUserId();
  }, []);

  const fetchCourses = async (studentId: string) => {
    const { data, error } = await supabase
      .from("course")
      .select("*")
      .eq("student_id", studentId);
    if (error) {
      console.error("Error fetching courses:", error);
    } else {
      console.log("Fetched courses:", data);
      setCourses(data);
      setLoading(false);
    }
  };
  const coursesByDay = DAYS.reduce(
    (acc, day) => {
      acc[day] = courses
        .filter((c) => getDayName(c.course_date) === day)
        .sort((a, b) => a.start_hour?.localeCompare(b.start_hour));
      return acc;
    },
    {} as Record<string, any[]>,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        <p className="text-gray-400 text-sm"> Yükleniyor...</p>
      </div>
    );
  }
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-400 text-sm">Henüy Ders eklenmedi.</p>
      </div>
    );
  }

  const weekLabel = `${weekDates[0].getDate()}/${weekDates[0].getMonth() + 1} – ${weekDates[6].getDate()}/${weekDates[6].getMonth() + 1}/${weekDates[6].getFullYear()}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <NavigationButton direction="prev" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="px-3 py-3 text-xs font-medium text-gray-600 text-center border-b border-gray-200 bg-gray-50"
                >
                  {day}
                  <div>
                    {weekDates[DAYS.indexOf(day)].getDate()}/
                    {weekDates[DAYS.indexOf(day)].getMonth() + 1}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="align-top">
              {DAYS.map((day) => (
                <td
                  key={day}
                  className="px-2 py-3 border-r border-gray-100 last:border-r-0 min-h-[120px]"
                  style={{ verticalAlign: "top" }}
                >
                  <div className="flex flex-col gap-2">
                    {coursesByDay[day].length === 0 ? (
                      <div className="h-16" />
                    ) : (
                      coursesByDay[day].map((course) => {
                        const color = getColor(
                          course.subject,
                          courses.map((c) => c.subject),
                        );
                        return (
                          <div
                            key={course.id}
                            className="rounded-lg px-2.5 py-2"
                            style={{
                              background: color.bg,
                              border: `0.5px solid ${color.border}`,
                            }}
                          >
                            <p
                              className="text-xs font-medium leading-tight"
                              style={{ color: color.text }}
                            >
                              {course.subject}
                            </p>
                            {course.title && (
                              <p
                                className="text-[11px] mt-0.5 leading-tight line-clamp-2"
                                style={{ color: color.text, opacity: 0.8 }}
                              >
                                {course.title}
                              </p>
                            )}
                            {course.start_hour && course.end_hour && (
                              <p
                                className="text-[10px] mt-1"
                                style={{ color: color.text, opacity: 0.7 }}
                              >
                                {formatTime(course.start_hour)} –{" "}
                                {formatTime(course.end_hour)}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => handleChangePage("prev")}
          className="text-sm text-gray-500 hover:text-purple-600 px-3 py-1.5 border rounded-lg"
        >
          Önceki Hafta
        </button>
        <span className="text-xs text-gray-400">{weekLabel}</span>
        <button
          onClick={() => handleChangePage("next")}
          className="text-sm text-gray-500 hover:text-purple-600 px-3 py-1.5 border rounded-lg"
        >
          Sonraki Hafta
        </button>
      </div>
    </div>
  );
}
