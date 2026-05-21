' use client '

import { useState } from "react";
import { useRouter } from "next/navigation";
import {supabase} from "@/lib/supabase";


export default function SignUp (){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSignUp(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const {error}= await supabase.auth.signUp({
            email,
            password,
            options : {
                data : {
                    full_name: fullName,
                    role: role

                }
            }        
    }
)
        if(error){
            setError(error.message);
            return;}
        router.push("/login");
}
    return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
            <input
            type="role"
            placeholder="Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-purple-600 text-white rounded-lg py-2 font-medium hover:bg-purple-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-purple-600 hover:underline">Log in</a>
        </p>
      </div>
    </main>
    )
}