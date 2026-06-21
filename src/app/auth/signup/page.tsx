"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MailCheck, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SignUp() {
  // Code Resending

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const GRADES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          full_name: fullName,
          role: role,
          grade: Number(grade),
        },
      },
    });

    if (error) {
      if(error.message)
      setError(error.message);
      return;
    }
    if (data.user && !data.session) {
      router.push(`/auth/confirm-email?email=${email}`);
      console.log("Mail kutunuzu kontrol ediniz");
      return;
    }
  }
  async function isEmailVerified(): Promise<boolean> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return false;
    return user.email_confirmed_at !== null;
  }
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    isEmailVerified().then((v) => {
      if (!mounted) return;
      setVerified(v);
      if (!v) console.log("Lütfen mailinizi dogrulayiniz.");
    });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400">
              <SelectValue placeholder="Sınıfınızı seçin" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => (
                <SelectItem key={g} value={String(g)}>
                  {g}.Sınıf
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="bg-purple-600 text-white rounded-lg py-2 font-medium hover:bg-purple-700"
          >
            Sign Up
          </Button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{" "}
          <a href="/auth/login" className="text-purple-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
