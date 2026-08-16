import { NextResponse } from 'next/server'; import { setAdminCookie } from '@/lib/auth';
export async function POST(req:Request){const {password}=await req.json();if(!process.env.ADMIN_PASSWORD||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:'Incorrect password'},{status:401});await setAdminCookie();return NextResponse.json({ok:true})}
