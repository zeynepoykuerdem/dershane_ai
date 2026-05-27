'use client'

import {useState} from 'react'
import Overview from "@/components/ui/overview"
import PerformanceChart from "@/components/ui/performanceChart"
import AIAgent from "@/components/ui/aiAgent"
import Navbar from "@/components/ui/navbar"


export default function StudentDashboard (){
   const [showCalendar, setShowCalendar] = useState(false)
    return (
      <div className="min-h-screen bg-gray-50">
          <Navbar onCalendarToggle={() => setShowCalendar(!showCalendar)} />
          <div className="grid grid-cols-4 gap-4 p-6 h-[calc(100vh-60px)]" >
        <Overview />
        <PerformanceChart />
        <AIAgent />
  

      </div>
      </div>
    


    
    
    )
  
    
   
}