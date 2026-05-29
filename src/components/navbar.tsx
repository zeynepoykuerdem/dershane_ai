'use client'
import CalendarComponent from "./ui/calendar_update"
import {useState} from 'react'
export default function Navbar({onCalendarToggle, onMenuToggle, onProfileToggle}:{onCalendarToggle: () => void, onMenuToggle: () => void, onProfileToggle: () => void}) {
    return (

        <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">

        <div className="flex items-center gap-6">
          <button className="sm:hidden text-gray-500 hover:text-purple-600" onClick={onMenuToggle}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
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
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
            fill="currentColor" viewBox="0 0 24 24" >
            <path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2M5 20V8h14V6v14z"></path><path d="M12 13h5v5h-5z"></path>
            </svg>
        
          </button>
          {/* Notification */}
          <button className="text-gray-500 hover:text-purple-600">
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
            fill="currentColor" viewBox="0 0 24 24" >
           <path d="M18 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6"/><path d="M13 6V4H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-8h-2v8H5V6z"/>
            </svg>
          </button>
          {/* Profile */}
          <button className="w-8 h-8 bg-purple-600 hover:text-purple-200 rounded-full flex items-center justify-center text-white text-sm font-bold" onClick={onProfileToggle}>
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
             fill="currentColor" viewBox="0 0 24 24" >

            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5m0-8c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1m6-7h4c2.76 0 5 2.24 5 5H5c0-2.76 2.24-5 5-5"></path>
            </svg>
          </button>
        </div>
      </nav>
    )
}