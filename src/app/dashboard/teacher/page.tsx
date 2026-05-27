'use client'
import {useState} from 'react'

import Overview from "@/components/ui/overview"
import PerformanceChart from "@/components/ui/performanceChart"
import AIAgent from "@/components/ui/aiAgent"


export default function TeacherDashboard() {
     return (
           <div className="grid grid-cols-4 gap-4 p-6 h-[calc(100vh-60px)]" >
             <Overview />
             <PerformanceChart />
             <AIAgent />
     
           </div>
     
     
         
         
         )
}