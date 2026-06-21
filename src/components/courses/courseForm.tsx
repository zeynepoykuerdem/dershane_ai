"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavigationButton } from "@/components/ui/navigation_button";
import Navbar from "@/components/navbar";

interface FormData {
  title: string;
  subject: string;
  student_id: string;
  course_date: string;
  start_hour: string;
  end_hour: string;
  description: string;
}

export function CourseForm() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subject: "",
    description: "",
    student_id: "",
    course_date: "",
    start_hour: "",
    end_hour: "",
  });
  {
    /** Course Submission Functions */
  }
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      description: "",
      student_id: "",
      course_date: "",
      start_hour: "",
      end_hour: "",
    });
    setEditId(null);
  };

  useEffect(() => {
    fetchStudents();
    handleRead();
  }, []);

  const fetchSubjects = async (studentId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("grade")
      .eq("id", studentId)
      .single();
    const { data, error } = await supabase
      .from("student_subjects")
      .select("subject")
      .eq("student_id", studentId);
    if (data) setSubjects(data.map((item: any) => item.subject));
    if (error) console.error("Hata olustu:", error);
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name")
      .eq("role", "student");

    if (data) setStudents(data);
    if (error) console.error("Hata olustu:", error);
  };
  const handleRead = async () => {
    const { data, error } = await supabase
      .from("course")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setCourses(data);
    if (error) console.error("Hata olustu:", error);
  };

  const handleInsert = async () => {
    setIsSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("course").insert({
      title: formData.title,
      subject: formData.subject,
      description: formData.description,
      student_id: formData.student_id,
      course_date: formData.course_date ?? "",
      start_hour: formData.start_hour || null,
      end_hour: formData.end_hour || null,
      teacher_id: user?.id,
    });
    setIsSubmitting(false);
    if (error) {
      console.error("Hata olustu:", error);
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    resetForm();
    handleRead();
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from("course")
      .update({
        title: formData.title,
        subject: formData.subject,
        description: formData.description ?? "",
        student_id: formData.student_id ?? "",
        course_date: formData.course_date ?? "",
        start_hour: formData.start_hour || null,
        end_hour: formData.end_hour || null,
      })
      .eq("id", id);
    if (error) {
      console.error("Hata olustu:", error);
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    resetForm();
    handleRead();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("course").delete().eq("id", id);
    if (!error) handleRead();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="fixed top-4 left-4 z-50">
        <NavigationButton direction="prev" />
      </div>

      {/* Form Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {editId ? "Dersi Düzenle" : "Yeni Ders Ekle"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {editId ? "Mevcut dersi güncelleyin" : "Öğrenciye ders atayın"}
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
            {/* Ders Başlığı */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">
                Ders Başlığı
              </Label>
              <Input
                placeholder="Örn: Türev Problemleri"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Öğrenci */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">
                Öğrenci
              </Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    student_id: value,
                    subject: "",
                  }));
                  fetchSubjects(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Öğrenci seçin" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ders */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">Ders</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subject: value }))
                }
                disabled={!formData.student_id}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.student_id ? "Ders seçin" : "Önce öğrenci seçin"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s: string) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Açıklama */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-gray-600">
                Açıklama
              </Label>
              <Textarea
                placeholder="Ders hakkında detaylı açıklama..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="resize-none"
                rows={3}
              />
            </div>
            {/** Ders Günü */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-gray-600">
                Ders Günü
              </Label>
              <Input
                type="date"
                value={formData.course_date}
                onChange={(e) =>
                  setFormData({ ...formData, course_date: e.target.value })
                }
              />
            </div>
            {/** Baslangic Saati */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-gray-600">
                Başlangıç Saati
              </Label>
              <Input
                type="time"
                value={formData.start_hour}
                onChange={(e) =>
                  setFormData({ ...formData, start_hour: e.target.value })
                }
              />
            </div>
            {/** Bitiş Saati */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-gray-600">
                Bitiş Saati
              </Label>
              <Input
                type="time"
                value={formData.end_hour}
                onChange={(e) =>
                  setFormData({ ...formData, end_hour: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              onClick={editId ? () => handleUpdate(editId) : handleInsert}
              disabled={isSubmitting || !formData.title || !formData.student_id}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              {isSubmitting
                ? "Kaydediliyor..."
                : editId
                  ? "Güncelle"
                  : "Dersi Kaydet"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ders Listesi */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Dersler
            {courses.length > 0 && (
              <span className="ml-2 text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {courses.length}
              </span>
            )}
          </h2>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl ">
            <p className="text-sm text-gray-400">Henüz ders eklenmedi</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-start justify-between gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">
                      {course.title}
                    </span>
                    {course.subject && (
                      <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        ({course.subject})
                      </span>
                    )}
                  </div>
                  {course.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  {course.course_date &&
                    course.start_hour &&
                    course.end_hour && (
                      <p className="text-xs text-gray-400 mt-2">
                        {course.course_date} | {course.start_hour} -{" "}
                        {course.end_hour}
                      </p>
                    )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    onClick={() => {
                      setFormData({
                        title: course.title,
                        subject: course.subject,
                        description: course.description,
                        start_hour: course.start_hour,
                        end_hour: course.end_hour,
                        student_id: course.student_id,
                        course_date: course.course_date,
                      });
                      setEditId(course.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs text-gray-400 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Düzenle
                  </Button>
                  <Button
                    onClick={() => handleDelete(course.id)}
                    className="text-xs text-gray-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
