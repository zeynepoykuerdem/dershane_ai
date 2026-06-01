'use client'

import { useState,useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ögrenci ödev listesi 

export function HomeworkList(){
    // supabaseden sadece kendi ödevlerini cek
    // HomeworkCard componenti kullanarak listele
    const [homeworks,setHomeworks] = useState<any[]>([])

    useEffect(() => {
        const getUserId = async () => {
            const { data:{user}} = await supabase.auth.getUser()
            if (user){
                console.log('User ID:', user.id)
                fetchHomeworks(user.id)}
            }
        getUserId()
            
    },[])

    const fetchHomeworks= async (studentId: string) => {
        const {data,error}= await supabase
        .from('homework')
        .select('*')
        .eq ('student_id', studentId)
        if (error) {
            console.error('Error fetching homeworks:', error)
        } else {
            console.log('Fetched homeworks:', data)
            setHomeworks(data)

        }
    }
    const handleComplete = async (id: number) => {
        const { error }= await supabase
        .from ('homework')
        .update ({is_completed: true})
        .eq('id', id)
        if (error) {
            console.error('Hata Olustu:', error)
        } else {
            console.log('Homework updated successfully')
        }
    }
    return (
        <div className= "overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Başlık</TableHead>
                        <TableHead>Açıklama</TableHead>
                        <TableHead>Teslim Tarihi</TableHead>
                        <TableHead>Ders</TableHead>
                        <TableHead>Durum</TableHead>
                    </TableRow>

                </TableHeader>
                <TableBody>
                    {homeworks.map((hw) =>(
                        <TableRow key={hw.id}>
                            <TableCell>{hw.title}</TableCell>
                            <TableCell>{hw.description}</TableCell>
                            <TableCell>{hw.due_date}</TableCell>
                            <TableCell>{hw.subject}</TableCell>
                            <TableCell>
                                <input 
                                type="checkbox"
                                onChange={() => handleComplete(hw.id)} 
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}