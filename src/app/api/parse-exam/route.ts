import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/** Dosya yüklenince Claude'a gönderip sinav verilerini pars etmesi icin */

export async function POST(request: NextRequest) {
  // 1)request.json()'dan değerleri al:
  const { base64, fileType, student_id, student_name } = await request.json();
  console.log("Requested body studentName:", student_name);
  console.log("Requested body student_id:", student_id);

  // 2)Dosya Tipine göre content block olustur
  /**
   * file var mi yok mu kontrol et ilk
   * Pdf -> type="document"
   * Image -> type="image"
   * source.type: "base64" source.data: "base64"
   *
   *
   */

  if (fileType === "application/pdf") {
  }

  // 3)Prompt yaz
  /**
   * Sinav sonuclarini JSON olarak parse etmesini iste
   * return subject,topic,score,max_score,exam_date,grades_source
   */

  // 4)Call anthropic.messages.create
  /* 
content -> files+prompt
**/

  const prompt = `Yüklenen dosyayi incele. Bu dosya bir Türk öğrencinin sınav sonuç belgesidir. Belgeyi analiz et ve aşağıdaki JSON formatında döndür. Sadece JSON döndür, başka hiçbir şey yazma.
  
  {
  "student_name": "Belgenin sol üst köşesinde, okul adının altında büyük harflerle yazılan öğrenci adı soyadı. Örnek: SEZGİN MASAL",
  "exams":[
  {
  "subject": "ders adi (örn: Matematik)",
  "topic": "konu (örn: Türev veya genel ise boş bırak)",
  "score": sayısal puan değeri,
  "max_score": maksimum puan değeri,
  "exam_date": "YYYY-MM-DD formatında tarih",
  "grades_source": "tyt, ayt, lgs, okul, dershane veya deneme",
  "kazanim_kodlari":["yanlis yapilan soruların kazanım kodları, örn: M.8.2.1.2, T.8.3.21" ]
}
  ]


  
  }
  
  
  
  
  Bu belgede 'NET' kolonu puani , 'S.S' soru sayisini gösterir. Eğer bir alani bulamazsan, Null olarak döndür.
  Kazanim kodlarina göre ögrenciye konu bazinda daha spesifik analiz yap. 
  
  
  
  
  `;

  const fileBlock =
    fileType === "application/pdf"
      ? {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: base64,
          },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: fileType as
              | "image/jpeg"
              | "image/png"
              | "image/gif"
              | "image/webp",
            data: base64,
          },
        };
  let message;
  try {
    message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [fileBlock, { type: "text", text: prompt }],
        },
      ],
    });
  } catch (error) {
    console.error("Anthropic error", error);
    return NextResponse.json({ error: "Claude Hatasi" }, { status: 500 });
  }

  // as const -> stringten literal tipe ceviriyor
  // 5) Cevabi pars et -> json a cevir
  /* 
return NextResponse.json({ exams: parsedData })
**/

  const response =
    message.content[0].type === "text" ? message.content[0].text : null;

  if (!response) {
    console.log("Burdan mi geliyor hata?");
    return NextResponse.json({ error: "Parse edilemedi" }, { status: 500 });
  }
  try {
    const clean = response.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(clean);
    const exams = parsedData.exams;

    console.log("Burda kaldim.");

    if (exams) {
      const parsedName = parsedData.student_name;
      console.log("Parsed Name:", parsedName);
      console.log("Sistemdeki isim:", student_name);
      if (parsedName && student_name) {
        const match =
          parsedName.toLowerCase().includes(student_name.toLowerCase()) ||
          student_name.toLowerCase().includes(parsedName.toLowerCase());
        if (!match) {
          return NextResponse.json(
            {
              error: " Isim eslesmiyor",
              message: `Belgede ${parsedName} ismi var, sisteme ${student_name} olarak kayitlisiniz.`,
            },
            { status: 500 },
          );
        }
      }
    }

    return NextResponse.json({ exams });
  } catch (error) {
    console.error("Burdan mi geldi:", error);
    return NextResponse.json(
      { error: "JSON parse hatasi", raw: response },
      { status: 500 },
    );
  }
}
