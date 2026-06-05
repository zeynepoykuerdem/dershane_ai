"use client";
import { useState } from "react";

import Overview from "@/components/sidebar";
import PerformanceChart from "@/components/performanceChart";
import AIAgent from "@/components/agent/aiAgent";
import Navbar from "@/components/navbar";

export default function TeacherDashboard() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Overview
        isOpen={sidebarOpen}
        role="teacher"
        onClose={() => setSidebarOpen(false)}
      />
      <div className="sm:ml-64">
        <Navbar
          onCalendarToggle={() => setShowCalendar(!showCalendar)}
          onMenuToggle={() => setSidebarOpen(true)}
          onProfileToggle={() => setProfileOpen(true)}
        />
        <div className="grid grid-cols-3 gap-4 p-6 h-[calc(100vh-60px)] overflow-auto">
          <PerformanceChart showCalendar={showCalendar} />
          <AIAgent />
        </div>
      </div>
    </div>
  );
}
