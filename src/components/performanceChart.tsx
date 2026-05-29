'use client'
import CalendarComponent from "./ui/calendar_update"
import {useState} from 'react'

export default function PerformanceChart({showCalendar}:{showCalendar: boolean}) {
   
    return (
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
    )
}