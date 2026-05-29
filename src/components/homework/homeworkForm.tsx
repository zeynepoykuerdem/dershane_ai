'use client'

import { useState,useEffect } from 'react'
import {supabase} from "@/lib/supabase"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"


interface FormData{
    title:string,
    subject:string,
    dueDate:string,
    description:string,
    student_id:string
}

export function HomeworkForm() {
    const [formData, setFormData] = useState<FormData>({ 
        title: '',
        subject:'',
        dueDate:'',
        description:'',
        student_id:''
     })
     {/** Homework Submission Functions */}
    const [homeworks, setHomeworks] = useState<any[]>([])
    const [students, setStudents] = useState<any[]>([]) 
    const [subjects,setSubjects]= useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const[ isSubmitted, setIsSubmitted] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)

    const resetForm = () => {
      setFormData({
        title: '',
        subject: '',
        dueDate: '',
        description: '',
        student_id: ''
      })
      setEditId(null)
    }

    useEffect(() => {
        fetchStudents()
        handleRead()
    }, [])

    const fetchSubjects = async (studentId: string) => {
        const {data, error} = await supabase
        .from('student_subjects')
        .select('subject')
        .eq('student_id', studentId)
        if (data) setSubjects(data.map((item: any) => item.subject))
        if (error) console.error('Hata olustu:', error)
    }

    const fetchStudents = async () => {
        const {data ,error} = await supabase
        .from ('profiles')
        .select('id,full_name')
        .eq('role','student')

        if (data) setStudents(data)
        if (error) console.error('Hata olustu:', error)
    }
    const handleRead = async () => {
        const {data, error} = await supabase
        .from('homework')
        .select('*')
        .order('created_at', {ascending: false})
        if (data) setHomeworks(data)
        if (error) console.error('Hata olustu:', error)
    }


    const handleInsert = async () => {
        setIsSubmitting(true)
        const {data:{user}} = await supabase.auth.getUser()
        const {error} = await supabase
        .from('homework')
        .insert({
            title:formData.title,
            subject:formData.subject,
            due_date:formData.dueDate,
            description:formData.description,
            student_id:formData.student_id,
            teacher_id:user?.id
        })
        setIsSubmitting(false)
        if (error) {
            console.error('Hata olustu:', error)
            return
        }

        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 3000)
        resetForm()
        handleRead()
    }
    
    const handleUpdate = async (id:string) => {
        const {error}= await supabase
        .from ('homework')
        .update({
            title:formData.title,
            subject:formData.subject,
            due_date:formData.dueDate,
            description:formData.description,
            student_id:formData.student_id
        })
        .eq('id',id)
        if (error) {
            console.error('Hata olustu:', error)
            return
        }

        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 3000)
        resetForm()
        handleRead()
    }

    const handleDelete = async (id: string) => {
        const {error} = await supabase
        .from('homework')
        .delete()
        .eq('id', id)
        if (!error) handleRead()
    }
    const isOverdue = (dueDate: string) => new Date(dueDate) < new Date()

return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Form Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {editId ? 'Ödevi Düzenle' : 'Yeni Ödev Ekle'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {editId ? 'Mevcut ödevi güncelleyin' : 'Öğrenciye ödev atayın'}
              </p>
            </div>
            {editId && (
              <button
                onClick={resetForm}
                className="text-xs text-gray-400 hover:text-gray-600 border rounded-lg px-3 py-1.5 transition-colors"
              >
                İptal
              </button>
            )}
          </div>

          {isSubmitted && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              ✓ İşlem başarılı
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Ödev Başlığı */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">Ödev Başlığı</Label>
              <Input
                placeholder="Örn: Türev Problemleri"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Teslim Tarihi */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">Teslim Tarihi</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            {/* Öğrenci */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">Öğrenci</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, student_id: value, subject: '' }))
                  fetchSubjects(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Öğrenci seçin" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ders */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">Ders</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                disabled={!formData.student_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.student_id ? "Ders seçin" : "Önce öğrenci seçin"} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s: string) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Açıklama */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-gray-600">Açıklama</Label>
              <Textarea
                placeholder="Ödev hakkında detaylı açıklama..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              onClick={editId ? () => handleUpdate(editId) : handleInsert}
              disabled={isSubmitting || !formData.title || !formData.student_id}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              {isSubmitting ? 'Kaydediliyor...' : editId ? 'Güncelle' : 'Ödevi Kaydet'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ödev Listesi */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Ödevler
            {homeworks.length > 0 && (
              <span className="ml-2 text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {homeworks.length}
              </span>
            )}
          </h2>
        </div>

        {homeworks.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400">Henüz ödev eklenmedi</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {homeworks.map((hw) => (
              <div
                key={hw.id}
                className="flex items-start justify-between gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{hw.title}</span>
                    {hw.subject}
                  </div>
                  {hw.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{hw.description}</p>
                  )}
                  {hw.due_date && (
                    <p className={`text-xs mt-2 font-medium ${isOverdue(hw.due_date) ? 'text-red-500' : 'text-gray-400'}`}>
                      {isOverdue(hw.due_date) ? '⚠ ' : '📅 '}
                      Son teslim: {new Date(hw.due_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => {
                      setFormData({
                        title: hw.title,
                        subject: hw.subject,
                        dueDate: hw.due_date,
                        description: hw.description,
                        student_id: hw.student_id
                      })
                      setEditId(hw.id)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="text-xs text-gray-400 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(hw.id)}
                    className="text-xs text-gray-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
