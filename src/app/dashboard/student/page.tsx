"use client";

import { useState, useEffect } from "react";
import Overview from "@/components/sidebar";
import PerformanceChart from "@/components/performanceChart";
import AIAgent from "@/components/agent/aiAgent";
import Navbar from "@/components/navbar";
import { supabase } from "@/lib/supabase/client";

export default function StudentDashboard() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Overview
        isOpen={sidebarOpen}
        role="student"
        onClose={() => setSidebarOpen(false)}
      />
      <div className="sm:ml-64">
        <Navbar
          onCalendarToggle={() => setShowCalendar(!showCalendar)}
          onMenuToggle={() => setSidebarOpen(true)}
          onProfileToggle={() => setProfileOpen(true)}
        />
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 p-4 sm:p-6 h-auto md:h-[calc(100vh-70px)] overflow-y-auto">
          <div className="w-full md:col-span-2">
            <PerformanceChart showCalendar={showCalendar} studentId={userId} />
          </div>
          <div className="w-full md:col-span-1">
            <AIAgent />
          </div>
        </div>
      </div>
    </div>
  );
}
