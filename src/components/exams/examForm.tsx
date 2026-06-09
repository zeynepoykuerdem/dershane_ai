"use client";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";
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

interface ExamData {
  subject: string;
  topic: string;
  score: number;
  max_score: number;
  exam_date: string;
  grades_source: string;
  file_url?: string;
}

export function ExamForm() {
  const [examData, setExamData] = useState<ExamData>({
    subject: "",
    topic: "",
    score: 0,
    max_score: 0,
    exam_date: "",
    grades_source: "",
    file_url: "",
  });

  const [exams, setExams] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [activeTab, setActiveTab] = useState<"manuel" | "dosya">("manuel");
  const [editId, setEditId] = useState<string | null>(null);

  const SOURCES = ["dershane", "okul", "tyt", "ayt", "lgs", "deneme"];

  const resetForm = () => {
    setExamData({
      subject: "",
      topic: "",
      score: 0,
      max_score: 0,
      exam_date: "",
      grades_source: "",
      file_url: "",
    });
    setEditId(null);
  };

  useEffect(() => {
    handleRead();
  }, []);

  const handleRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("student_id", user?.id)
      .order("created_at", { ascending: false });
    if (data) setExams(data);
    if (error) console.error("Hata olustu:", error);
  };
  const handleInsert = async () => {
    setIsSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("exams").insert({
      subject: examData.subject,
      topic: examData.topic,
      score: examData.score ?? null,
      max_score: examData.max_score,
      exam_date: examData.exam_date,
      grades_source: examData.grades_source,
      file_url: examData.file_url,
      student_id: user?.id,
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
      .from("exams")
      .update({
        subject: examData.subject,
        topic: examData.topic,
        score: examData.score ?? null,
        max_score: examData.max_score,
        exam_date: examData.exam_date,
        grades_source: examData.grades_source,
        file_url: examData.file_url,
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
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (!error) handleRead();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 overflow-hidden">
      {/** Tab Secimi -> manuel | dosya */}
      {/** dosya */}

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("manuel")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "manuel"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Manuel Giriş
        </button>
      </div>

      {/** Manuel Giris */}
      {activeTab === "manuel" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {editId ? "Sinavi  Düzenle" : " Yeni Sinav Ekle"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editId
                    ? "Mevcut sinavi güncelleyin"
                    : "Öğrenciye Sinav ekleyin"}
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
              {/** Ders Ismi */}

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">
                  Ders Ismi
                </Label>
                <Input
                  placeholder="Örn: Kimya"
                  value={examData.subject}
                  onChange={(e) =>
                    setExamData({ ...examData, subject: e.target.value })
                  }
                />
              </div>
              {/** Ders Konusu */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">
                  Sinav Konusu
                </Label>
                <Input
                  placeholder="Örn: Organik Kimya"
                  value={examData.topic}
                  onChange={(e) =>
                    setExamData({ ...examData, topic: e.target.value })
                  }
                />
              </div>

              {/** Sinav  Sonucu */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">
                  Sinav Sonucu
                </Label>
                <Input
                  value={examData.score}
                  onChange={(e) =>
                    setExamData({ ...examData, score: Number(e.target.value) })
                  }
                />
              </div>
              {/** Sinavda Alinabilinecek En yüksek Puan  */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">
                  Sinavda Alinabilinecek En yüksek Puan
                </Label>
                <Input
                  value={examData.max_score}
                  onChange={(e) =>
                    setExamData({
                      ...examData,
                      max_score: Number(e.target.value),
                    })
                  }
                />
              </div>
              {/** Sinav Tarihi */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-gray-600">
                  Sinav Günü
                </Label>
                <Input
                  type="date"
                  value={examData.exam_date}
                  onChange={(e) =>
                    setExamData({ ...examData, exam_date: e.target.value })
                  }
                />
              </div>
              {/** Sinav Kaynak */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-gray-600">
                  Sinav Kaynak
                </Label>
                <Select
                  value={examData.grades_source}
                  onValueChange={(value) =>
                    setExamData((prev) => ({ ...prev, grades_source: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kaynak Secin" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCES.map((s: string) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                onClick={editId ? () => handleUpdate(editId) : handleInsert}
                disabled={
                  isSubmitting || !examData.subject || !examData.grades_source
                }
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                {isSubmitting
                  ? "Kaydediliyor.."
                  : editId
                    ? "Güncelle "
                    : " Sınavı Kaydet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {/** Sinav Listesi */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Sinavlar
            {exams.length > 0 && (
              <span className="ml-2 text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {exams.length}
              </span>
            )}
          </h2>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400">Henüz sinav eklenmedi</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-start justify-between gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">
                      {exam.subject}
                    </span>
                    {exam.topic && (
                      <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        ({exam.topic})
                      </span>
                    )}
                  </div>
                  {exam.exam_date && exam.grades_source && (
                    <p className="text-xs text-gray-400 mt-2">
                      {exam.exam_date} | {exam.grades_source}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    onClick={() => {
                      setExamData({
                        subject: exam.subject,
                        topic: exam.topic,
                        score: exam.score ?? null,
                        max_score: exam.max_score,
                        exam_date: exam.exam_date,
                        grades_source: exam.grades_source,
                        file_url: exam.file_url,
                      });
                      setEditId(exam.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs text-gray-400 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Düzenle
                  </Button>
                  <Button
                    onClick={() => handleDelete(exam.id)}
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
