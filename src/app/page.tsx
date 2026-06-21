import Link from "next/link";
import { Users, Brain, ClipboardCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <a
            href="/"
            className="text-purple-700 text-lg font-bold tracking-tight"
          >
            Studiee AI
          </a>
          <div className="flex items-center gap-1">
            <a
              href="/auth/login"
              className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Giriş Yap
            </a>
            <a
              href="/auth/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Kayıt Ol
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/60 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto text-center px-4 relative">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            AI destekli dershane yönetimi
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5 max-w-3xl mx-auto leading-tight">
            Öğrencilerinizi{" "}
            <span className="bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
              daha akıllıca
            </span>{" "}
            takip edin
          </h1>
          <p className="text-base md:text-lg text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Ödevler, ders programı, sınav sonuçları ve AI destekli performans
            analizi — hepsi tek yerde.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/auth/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 text-sm font-medium rounded-xl shadow-md shadow-purple-200 transition-all hover:shadow-lg hover:shadow-purple-300">
                Hemen Başla
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700 px-7 py-3 text-sm font-medium rounded-xl transition-all"
              >
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">
            Öne çıkan özellikler
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: <Users size={20} className="text-purple-600" />,
                bg: "bg-purple-100",
                title: "Öğrenci takibi",
                desc: "Öğrenci ve öğretmen yönetimi tek panelden",
              },
              {
                icon: <Brain size={20} className="text-teal-600" />,
                bg: "bg-teal-100",
                title: "AI performans analizi",
                desc: "Zayıf konuları tespit et, kişisel öneriler al",
              },
              {
                icon: <ClipboardCheck size={20} className="text-amber-600" />,
                bg: "bg-amber-100",
                title: "Ödev yönetimi",
                desc: "Ödev ata, takip et, bildirim gönder",
              },
              {
                icon: <Calendar size={20} className="text-blue-600" />,
                bg: "bg-blue-100",
                title: "Ders programı",
                desc: "Haftalık ders takvimi ve anlık güncellemeler",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-4`}
                >
                  {item.icon}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-3xl p-10 md:p-14 text-center shadow-xl shadow-purple-200">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Dershanenizi dijitalleştirmeye hazır mısınız?
            </h2>
            <p className="text-purple-100 text-base md:text-lg mb-8">
              Ücretsiz başlayın, istediğiniz zaman yükseltin.
            </p>
            <Link href="/auth/signup">
              <Button className="bg-white  text-purple-700 hover:bg-purple-50 px-8 py-3 text-sm font-semibold rounded-xl shadow-md transition-all">
                Hemen Basla
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100">
        <p>© 2026 Studiee. Tüm hakları saklıdır.</p>
      </footer>
    </main>
  );
}
