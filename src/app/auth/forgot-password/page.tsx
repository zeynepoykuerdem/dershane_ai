/**
 *  email gir-> supabase e link göndericek
 * react component lazim-> next.js bunu render edemez
 * Form ve input yok
 */
"use client";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success,setSuccess]=useState(false);

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm text-center flex flex-col gap-4">
        <MailCheck className="mx-auto text-purple-600" size={48} />
        <h1 className="text-2xl font-bold">
          Email'inizi Sifreyi Sifirlayabilmek icin Giriniz
        </h1>
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && <p className="text-green-600">Email gönderildi, kutunuzu kontrol edin!</p>}

          <Button
            type="submit"
            className="bg-purple-600 text-white rounded-lg py-2 font-medium hover:bg-purple-700"
          >
            Parolayi Yenile
          </Button>
        </form>
      </div>
    </main>
  );
}
