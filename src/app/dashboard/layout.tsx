'use client'

import Navbar from "@/components/ui/navbar"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
        <Navbar/>
        {children}
    
    </div>

  )
  
}
    