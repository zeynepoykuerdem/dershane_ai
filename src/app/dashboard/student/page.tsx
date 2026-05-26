'use client'
import CalendarComponent from "@/app/dashboard/student/calendar/page"
import { useRouter } from "next/navigation";
import {useState} from 'react'

export default function StudentDashboard (){
  
    const [showCalendar, setShowCalendar] = useState(false)
    return (
         <div className="min-h-screen bg-gray-50">
      
      {/* Navbar */}
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
          <button className="text-gray-500 hover:text-purple-600 text-sm border rounded-lg px-3 py-1.5" onClick={() => setShowCalendar(!showCalendar)}>
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

      {/* 3 Kolon Layout */}
      <div className="grid grid-cols-4 gap-4 p-6 h-[calc(100vh-60px)]">
        
        {/* Sol Kolon — Overview */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl border p-4">
            <h2 className="font-semibold text-gray-700 mb-3">Overview</h2>
            <div className="flex flex-col gap-3">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Ortalama Not</p>
                <p className="text-2xl font-bold text-purple-600">85</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Tamamlanan Ödev</p>
                <p className="text-2xl font-bold text-blue-600">12/15</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Devamsızlık</p>
                <p className="text-2xl font-bold text-green-600">2 gün</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border p-4 mt-auto">
            <a href="#" className="text-sm text-gray-500 hover:text-purple-600">⚙️ Ayarlar</a>
          </div>
        </div>

        {/* Orta Kolon — Performans Analizi */}
        <div className="col-span-2 bg-white rounded-xl border p-4 overflow-y-auto">
          {showCalendar? (
            <CalendarComponent />

          ): (
            <>
            <h2 className="font-semibold text-gray-700 mb-4">Performans Analizi</h2>
            <div className="flex flex-col gap-3">
            {[
              { ders: 'Matematik', not: 72, renk: 'bg-red-400' },
              { ders: 'Fizik', not: 85, renk: 'bg-yellow-400' },
              { ders: 'Kimya', not: 90, renk: 'bg-green-400' },
              { ders: 'Biyoloji', not: 78, renk: 'bg-blue-400' },
              { ders: 'Türkçe', not: 95, renk: 'bg-purple-400' },
            ].map((item) => (
              <div key={item.ders} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20">{item.ders}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className={`${item.renk} h-3 rounded-full`}
                    style={{ width: `${item.not}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-8">{item.not}</span>
              </div>
            ))}
          </div>

          {/* Son Sınavlar */}
          <h3 className="font-semibold text-gray-700 mt-6 mb-3">Son Sınavlar</h3>
          <div className="flex flex-col gap-2">
            {[
              { sinav: 'Matematik Deneme', tarih: '20 May', not: 68 },
              { sinav: 'Fizik Quiz', tarih: '18 May', not: 82 },
              { sinav: 'Kimya Denemesi', tarih: '15 May', not: 91 },
            ].map((item) => (
              <div key={item.sinav} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-600">{item.sinav}</span>
                <span className="text-xs text-gray-400">{item.tarih}</span>
                <span className={`text-sm font-bold ${item.not >= 80 ? 'text-green-600' : 'text-red-500'}`}>
                  {item.not}
                </span>
              </div>
            ))}
          </div>
  
      
            </>

          )}
        </div>
          

        {/* Sağ Kolon — AI Agent */}
        <div className="col-span-1 bg-white rounded-xl border p-4 flex flex-col">
          <h2 className="font-semibold text-gray-700 mb-3">AI Agent</h2>
          
          {/* Zayıf Konu Önerileri */}
          <div className="bg-purple-50 rounded-lg p-3 mb-3">
            <p className="text-xs font-medium text-purple-700 mb-2">Zayıf Konular</p>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600">• Matematik — Türev</span>
              <span className="text-xs text-gray-600">• Fizik — Elektrik</span>
            </div>
          </div>

          {/* Chat alanı */}
          <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
            <div className="bg-purple-100 rounded-lg p-2 mb-2">
              <p className="text-xs text-purple-800">Merhaba! Matematik notun düşük, türev konusunu çalışmanı öneririm.</p>
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Soru sor..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="bg-purple-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-purple-700">
              →
            </button>
          </div>
        </div>

      </div>
    </div>
    )
  
    
   
}