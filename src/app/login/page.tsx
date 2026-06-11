"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", (await supabase.auth.getUser()).data.user?.id)
      .single();
    if (profile?.role === "admin") {
      router.push("/dashboard/admin");
    } else if (profile?.role === "teacher") {
      router.push("/dashboard/teacher");
    } else {
      router.push("/dashboard/student");
    }
    console.log("profile", profile);
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <Button
            type="submit"
            className="bg-gray-400 text-purple-200 hover:bg-purple-500 px-8 py-3 text-sm font-semibold rounded-xl shadow-md transition-all"
          >
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}
