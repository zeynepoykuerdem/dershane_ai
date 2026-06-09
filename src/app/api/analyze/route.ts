import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  const { question, student_id } = await request.json();
  console.log('student_id:',student_id)

  

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  console.log('service key:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20))

  const { data: exams, error: examsError } = await supabase
    .from("exams")
    .select("*")
    .eq("student_id", student_id)
    .order("created_at", { ascending: false });

  console.log('exams error;',examsError)
  

  const studentName = exams?.[0]?.profiles?.full_name ?? "Ögrenci";

  console.log('exams data:', exams)

  const examsSummary = exams
    ?.map(
      (exam) => `
- Ders: ${exam.subject}
- Konu: ${exam.topic}
- Kaynak: ${exam.grades_source}
- Puan: ${exam.score}/${exam.max_score}
- Sınav türü: ${exam.grades_source}
- Tarih: ${exam.exam_date}
`,
    )
    ?.join("\n");

  const prompt = `
    Sen bir yapay zeka asistanısın. ${studentName} adli ögrencinin geçmiş sınav performansına dayanarak, ona en iyi şekilde yardımcı olmak için sorusunu analiz etmen gerekiyor. 
    İşte öğrencinin geçmiş sınav performansı:
    ${examsSummary}
    Öğrencinin Sorusu: ${question}
    Değerlendirmen gereken kriterler:
    1. Öğrencinin geçmiş sınav performansına dayanarak, sorunun hangi konuya ait olduğunu belirle.
    2. Sorunun hangi sınav türüne ait olduğunu belirle (örneğin, matematik, fen, sosyal bilgiler vb.).
    3. Sorunun öğrencinin geçmiş performansına göre hangi konularda daha fazla yardıma ihtiyaç duyduğunu belirle.
    4. Sorunun öğrencinin geçmiş performansına göre hangi konularda daha az yardıma ihtiyaç duyduğunu belirle.
    5. Bu verilere dayanarak, öğrenciye en iyi şekilde yardımcı olmak için hangi kaynaklar ve çalışma stratejileri önerirsin?
    Cevabını açık ve anlaşılır bir şekilde ver.
    
    `;
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const response =
    message.content[0].type === "text"
      ? message.content[0].text
      : " Üzgünüm, sorunu anlayamadım. Lütfen daha fazla bilgi ver veya sorunu farklı bir şekilde ifade et.";

  return NextResponse.json({ response });
}
