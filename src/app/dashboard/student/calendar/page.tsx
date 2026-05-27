' use client'

import { useState} from 'react'

import { Calendar } from "@/components/ui/calendar"

const sampleEvents = [
    { date: '2026-05-26', subject: 'Matematik', topic: 'İstatistik', startTime:'09:00', endTime:'10:00' },
    { date: '2026-05-27', subject: 'Kimya', topic: 'Organik Kimya', startTime:'11:00', endTime:'12:00' },
    { date: '2026-05-28', subject: 'Fizik', topic: 'Mekanik', startTime:'14:00', endTime:'15:00' },
]

export default function CalendarComponent(){
    const [date, setDate] = useState<Date | undefined>(new Date())
    const selectedDateStr= date?.toISOString().split('T').at(0) || ''
    const todaysEvents= sampleEvents.filter(event => event.date === selectedDateStr)
    const [addingEvent, setAddingEvent] = useState(false)
    const [newEvent, setNewEvent] = useState({ subject: '', topic: '', startTime: '', endTime: '' })

    const handleAddEvent = () => {}
    {/** eger role == 'teacher' veya 'admin ' ise bu buton gözükücek */}

    return (
        <div className="flex flex-col gap-4 ">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border w-full [&_table]:w-full [&_td]:w-full [&_th]:w-full" captionLayout="dropdown" />
            <div className= " rounded-lg border w-full p-4">
                <h3 className="font-medium text-gray-700 mb-3">
                    {date?.toLocaleDateString('tr-TR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    
                </h3>
                {todaysEvents.length === 0 ? (
                    <p className="text-sm text-gray-400"> Bu gün için etkinlik bulunmamaktadır.</p>
                ) : (
                    todaysEvents.map((event, index) => (
                        <div key={index} className="mb-2 p-2 bg-white rounded shadow">
                            <p className="text-sm font-semibold text-gray-800">{event.subject}</p>
                            <p className="text-xs text-gray-500">{event.topic}</p>
                            {event.startTime && event.endTime && (
                                <p className="text-xs text-gray-500">{event.startTime} - {event.endTime}</p>
                            )}
                        </div>

                )
            )

                )}

            </div>

        </div>
       

    )

}
