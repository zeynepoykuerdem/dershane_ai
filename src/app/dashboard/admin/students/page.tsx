"use client";
import PerformanceChart from "@/components/performanceChart";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Card,CardContent} from "@/components/ui/card"

interface StudentItem {
  full_name: string;
  id: string;
}
export default function Students() {
  const [studentsData, setStudentsData] = useState<StudentItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id,full_name")
        .eq("role", "student");
      if (data) setStudentsData(data);
    };

    fetchStudents();
  }, []);
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {studentsData.map((s) => (
          <Card
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              selectedId === s.id
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-purple-400"
            }`}
          >
            <CardContent className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-center text-purple-700 text-sm font-medium">
                {s.full_name?.charAt(0)}


              </div>
              <span className="text-sm font-medium text-gray-800">
                  {s.full_name}
                </span>
            </CardContent>
            
          </Card>
        ))}
      </div>
      {selectedId ? (
        <PerformanceChart showCalendar={false} studentId={selectedId} />
      ) : (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400">
            Performansı görmek için öğrenci seçin
          </p>
        </div>
      )}
    </div>
  );
}
