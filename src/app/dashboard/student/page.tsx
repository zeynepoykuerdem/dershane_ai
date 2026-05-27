'use client'

import {useState} from 'react'
import Overview from "@/components/ui/overview"
import PerformanceChart from "@/components/ui/performanceChart"
import AIAgent from "@/components/ui/aiAgent"
import Navbar from "@/components/ui/navbar"



export default function StudentDashboard (){
   const [showCalendar, setShowCalendar] = useState(false)
   const [sidebarOpen, setSidebarOpen] = useState(false)
    return (
      <div className="min-h-screen bg-gray-50">
        <Overview isOpen={sidebarOpen} onClose={ ()=> setSidebarOpen(false)

        } />
        <div className="sm:ml-64">
          <Navbar onCalendarToggle={() => setShowCalendar(!showCalendar)} onMenuToggle={ ()=> setSidebarOpen(true) } />
          <div className="grid grid-cols-3 gap-4 p-6 h-[calc(100vh-60px)] overflow-auto">
            <PerformanceChart showCalendar={showCalendar} />
            <AIAgent />
          </div>
        </div>
      </div>
    


    
    
    )
  
    
   
}