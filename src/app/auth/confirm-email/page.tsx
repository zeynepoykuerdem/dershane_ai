'use client'
import { MailCheck } from "lucide-react";

import {use} from 'react'
export default function ConfirmEmailPage({
  searchParams,
}: {
  searchParams:Promise< { email?: string }>;
}) {
  const params = use(searchParams);
  const email = params?.email;
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm text-center flex flex-col gap-4">
        <MailCheck className="mx-auto text-purple-600" size={48} />
        <h1 className="text-2xl font-bold">Email'inizi Doğrulayın</h1>
        <p className="text-gray-500 text-sm">
          <strong>{email}</strong> adresine doğrulama linki gönderdik. Lütfen
          mailinizi kontrol edin.
        </p>
        <a
          href="/auth/login"
          className="text-purple-600 text-sm hover:underline"
        >
          Giriş sayfasına dön
        </a>
      </div>
    </main>
  );
}
