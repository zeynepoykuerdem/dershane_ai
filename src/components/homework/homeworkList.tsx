'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { NavigationButton } from '../ui/navigation_button'

type Tab = 'yapilacak' | 'tamamlandi' | 'gecikis'

const PALETTE = [
  { bg: '#EEEDFE', text: '#3C3489', border: '#AFA9EC' },
  { bg: '#E1F5EE', text: '#085041', border: '#5DCAA5' },
  { bg: '#FAEEDA', text: '#633806', border: '#EF9F27' },
  { bg: '#EAF3DE', text: '#27500A', border: '#97C459' },
  { bg: '#FAECE7', text: '#712B13', border: '#F0997B' },
  { bg: '#E6F1FB', text: '#0C447C', border: '#85B7EB' },
]

const getColor = (subject: string, subjects: string[]) => {
  const unique = [...new Set(subjects)]
  const idx = unique.indexOf(subject) % PALETTE.length
  return PALETTE[idx < 0 ? 0 : idx]
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const isOverdue = (dateStr: string, completed: boolean) => {
  if (!dateStr || completed) return false
  return new Date(dateStr) < new Date()
}

export function HomeworkList() {
  const [homeworks, setHomeworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('yapilacak')

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) fetchHomeworks(user.id)
    }
    getUserId()
  }, [])

  const fetchHomeworks = async (studentId: string) => {
    const { data, error } = await supabase
      .from('homework')
      .select('*')
      .eq('student_id', studentId)
      .order('due_date', { ascending: true })
    if (error) {
      console.error('Error fetching homeworks:', error)
    } else {
      setHomeworks(data)
    }
    setLoading(false)
  }

  const handleComplete = async (id: number, current: boolean) => {
    const next = !current
    setHomeworks(prev => prev.map(hw => hw.id === id ? { ...hw, is_completed: next } : hw))
    const { error } = await supabase
      .from('homework')
      .update({ is_completed: next })
      .eq('id', id)
    if (error) {
      console.error('Güncelleme hatası:', error)
      setHomeworks(prev => prev.map(hw => hw.id === id ? { ...hw, is_completed: current } : hw))
    }
  }

  const uniqueSubjects = [...new Set(homeworks.map(h => h.subject))]

  const byDate = (a: any, b: any) =>
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()

  const groups = {
    yapilacak: homeworks.filter(hw => !hw.is_completed && !isOverdue(hw.due_date, hw.is_completed)).sort(byDate),
    tamamlandi: homeworks.filter(hw => hw.is_completed).sort(byDate),
    gecikis: homeworks.filter(hw => isOverdue(hw.due_date, hw.is_completed)).sort(byDate),
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'yapilacak', label: 'Yapılacaklar' },
    { key: 'tamamlandi', label: 'Tamamlananlar' },
    { key: 'gecikis', label: 'Gecikenler' },
  ]

  const renderCard = (hw: any) => {
    const color = getColor(hw.subject, uniqueSubjects)
    const overdue = isOverdue(hw.due_date, hw.is_completed)
    return (
      <div
        key={hw.id}
        className={`flex items-start gap-4 rounded-xl border px-4 py-3 transition-opacity ${hw.is_completed ? 'opacity-50' : 'opacity-100'}`}
        style={{ borderColor: color.border, background: color.bg }}
      >
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={!!hw.is_completed}
            onChange={() => handleComplete(hw.id, !!hw.is_completed)}
            className="w-4 h-4 rounded cursor-pointer accent-purple-600"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={`text-sm font-semibold leading-tight ${hw.is_completed ? 'line-through' : ''}`}
              style={{ color: color.text }}
            >
              {hw.title}
            </p>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-medium border"
              style={{ color: color.text, borderColor: color.border, background: 'white' }}
            >
              {hw.subject}
            </span>
          </div>
          {hw.description && (
            <p className="text-[12px] mt-1 text-gray-500 line-clamp-2">
              {hw.description}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className={`text-xs font-medium ${overdue ? 'text-red-500' : 'text-gray-500'}`}>
            {formatDate(hw.due_date)}
          </p>
          {hw.is_completed && (
            <p className="text-[11px] text-green-500 mt-0.5 font-medium">Tamamlandı</p>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        Yükleniyor...
      </div>
    )
  }

  if (homeworks.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-400 text-sm">Henüz ödev eklenmedi.</p>
      </div>
    )
  }

  const activeList = groups[activeTab]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center">
        <NavigationButton direction="prev" />
      </div>

      {/* Notion-style tab bar */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.key
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {groups[tab.key].length}
            </span>
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-2">
        {activeList.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">Bu kategoride ödev yok.</p>
          </div>
        ) : (
          activeList.map(renderCard)
        )}
      </div>
    </div>
  )
}
