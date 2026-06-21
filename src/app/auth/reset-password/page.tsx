/**
 *
 * kullanici linke tikladi-> yeni sifre girmek icin olusan sayfa
 *
 */
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm text-center flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Yeni Sifrenizi Giriniz</h1>
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <div className="relative">
            <Input
              id="next"
              type={showNewPassword ? "password" : "text"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifrenizi girin"
              className="pr-10"
            />
            <button
              type="button"
              id="newP"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <a
              href="/auth/login"
              className="text-sm text-purple-600 hover:underline text-center"
            >
              Giris
            </a>
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <p className="text-green-600">Sifreniz Basariyla degistirildi!</p>
          )}

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
