import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";



export async function GET(request:Request){
    const{searchParams}= new URL(request.url)
    const code= searchParams.get('code')

    const redirectTo= new URL('/auth/login',request.url)

    if(code){
        const supabase=await createClient()
        const {error}= await supabase.auth.exchangeCodeForSession(code)
        if(!error){
            return NextResponse.redirect(redirectTo)
        }
    }
    return NextResponse.redirect(new URL('/auth/error',request.url))
}