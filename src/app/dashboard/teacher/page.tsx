"use client";
import { useState } from "react";

import Overview from "@/components/sidebar";

import AIAgent from "@/components/agent/aiAgent";
import Navbar from "@/components/navbar";
import CalendarComponent from "@/components/ui/calendar_update"


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
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 p-4 sm:p-6 h-auto md:h-[calc(100vh-70px)] overflow-y-auto">
      
          <div className="w-full md:col-span-2">
            <AIAgent />
          </div>
          <div className="w-full md:col-span-1">
            <CalendarComponent/>

          </div>
    
        </div>
      </div>
    </div>
  );
}
