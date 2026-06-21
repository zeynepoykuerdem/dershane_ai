import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  const { question, student_id, role } = await request.json();
  console.log("student_id:", student_id);
  console.log("student_id:", role);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

   let examsQuery = supabase
    .from("exams")
    .select("*, profiles!exams_student_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  // Sadece öğrenci kendi verisini görür
  if (role === "student") {
    examsQuery = examsQuery.eq("student_id", student_id);
  }

  

  const { data: exams, error: examsError } = await examsQuery;
  
  
  if(examsError){
    console.log("exams error;", examsError);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });

  }
  

  const studentName = 
       role==="student"
       ?(exams?.[0]?.profiles as {full_name?:string})?.full_name?? "Ögrenci"
       :"Dershane";
  


  const examsSummary = exams
    ?.map(
      (exam) => `
-${role!=="student"? `Ögrenci:${(exam.profiles as { full_name?: string })?.full_name}` : ""}      
- Ders: ${exam.subject}
- Konu: ${exam.topic}
- Kaynak: ${exam.grades_source}
- Puan: ${exam.score}/${exam.max_score}
- Sınav türü: ${exam.grades_source}
- Tarih: ${exam.exam_date}
`,
    )
    ?.join("\n");

  const getSystemPrompt = (role: string) => {
    if (role === "admin") {
      return `Sen bir dershane yönetim asistanısın.Genel performans trendleri, sınıf ortalamaları ve öğretmen bazlı raporlar üzerine analiz yaparsın. Yöneticiye net, özet ve karar destekleyici bilgiler sun.`;
    }
    if (role === "teacher") {
      return `Sen bir öğretmen asistanısın.Sadece kendi öğrencilerinin verilerini analiz edersin. Öğrencilerin güçlü/zayıf yönlerini tespit et, öğretmene sınıf yönetimi ve ders planlaması için öneriler sun.`;
    }
    return `Sen bir öğrenci asistanısın. Öğrenciye arkadaşça, motive edici ve anlaşılır bir dilde yanıt ver. Teknik terimlerden kaçın, somut çalışma önerileri sun.`;
  };

  const getUserPrompt = (
    role: string,
    examsSummary: string,
    question: string,
    studentName: string,
  ) => {
    if (role === "admin") {
      return `
      Dershane genelindeki sınav verileri:
${examsSummary}

Yöneticinin sorusu: ${question}

Cevap formatı:
## 📊 Genel Performans Özeti
## ⚠️ Dikkat Gerektiren Alanlar
## ✅ Başarılı Alanlar
## 💡 Yönetim Önerileri
    `;
    }
    if (role === "teacher") {
      return `
    Öğrencilerin sınav verileri:
${examsSummary}

Öğretmenin sorusu: ${question}

Cevap formatı:
## 📊 Sınıf Performans Özeti
## ⚠️ Zayıf Kalan Konular
## ✅ Güçlü Alanlar
## 📚 Ders Planı Önerileri
    
    
  
      `;
    }
    return `
    Sen bir yapay zeka asistanısın. ${studentName} adli ögrencinin geçmiş sınav performansına dayanarak, ona en iyi şekilde yardımcı olmak için sorusunu analiz etmen gerekiyor. 
    İşte öğrencinin geçmiş sınav performansı:
    ${examsSummary}
    Öğrencinin Sorusu: ${question}
    Değerlendirmen gereken kriterler:
    1. Öğrencinin geçmiş sınav performansına dayanarak, sorunun hangi konuya ait olduğunu belirle.
    2. Sorunun hangi sınav türüne ait olduğunu belirle (örneğin, matematik, fen, sosyal bilgiler vb.).
    3. Denemedeki kazanim sonuclarina göre hangi konularda eksik oldugunu detayli bildir.
    3. Sorunun öğrencinin geçmiş performansına göre hangi konularda daha fazla yardıma ihtiyaç duyduğunu belirle.
    4. Sorunun öğrencinin geçmiş performansına göre hangi konularda daha az yardıma ihtiyaç duyduğunu belirle.
    5. Bu verilere dayanarak, öğrenciye en iyi şekilde yardımcı olmak için hangi kaynaklar ve çalışma stratejileri önerirsin?
    Cevabını açık ve anlaşılır bir şekilde ver.

    Vermen gereken cevap formati söyle olsun : 
    ##📊 Performans Özeti
    Her ders için kısa özet (1-2 cümle)
    ## ⚠️ Zayıf Konular
    - Ders adı: konu adı (puan/max_puan)

    ## ✅ Güçlü Yönler  
    - Ders adı: neden iyi

    ## 📚 Çalışma Önerileri
    Her zayıf konu için 2-3 spesifik öneri
    
    
    
    `;
  };

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: getSystemPrompt(role),
    messages: [
      {
        role: "user",
        content: getUserPrompt(role, examsSummary ?? "", question, studentName),
      },
    ],
  });
  const response =
    message.content[0].type === "text"
      ? message.content[0].text
      : " Üzgünüm, sorunu anlayamadım. Lütfen daha fazla bilgi ver veya sorunu farklı bir şekilde ifade et.";

  return NextResponse.json({ response });
}
