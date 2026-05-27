'use client'
import CalendarComponent from "@/app/dashboard/student/calendar/page"
import {useState} from 'react'
export default function Navbar({onCalendarToggle}:{onCalendarToggle: () => void}) {
    const [showCalendar, setShowCalendar] = useState(false)
    return (
        <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-purple-600 text-lg">Studiee</span>
          <a href="#" className="text-sm text-gray-600 hover:text-purple-600">Home</a>
          <a href="#" className="text-sm text-gray-600 hover:text-purple-600">AI Agent</a>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Ara..."
            className="border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 w-40"
          />
          {/* Calendar */}
          <button className="text-gray-500 hover:text-purple-600 text-sm border rounded-lg px-3 py-1.5" onClick={onCalendarToggle}>
            📅 Takvim
        
          </button>
          {/* Notification */}
          <button className="text-gray-500 hover:text-purple-600">
            🔔
          </button>
          {/* Profile */}
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            Ö
          </div>
        </div>
      </nav>
    )
}