import { NextResponse } from 'next/server'; import crypto from 'crypto'; import { z } from 'zod'; import { getSupabaseAdmin } from '@/lib/supabase';
const schema=z.object({name:z.string().min(2),email:z.string().email(),phone:z.string().optional().nullable(),party_size:z.number().int().min(1).max(8),arrival_time:z.string().min(1),departure_time:z.string().min(1),notes:z.string().optional().nullable(),task_ids:z.array(z.string().uuid()).max(6)});
export async function POST(req:Request){try{const body=schema.parse(await req.json());const db=getSupabaseAdmin();const code=crypto.randomBytes(8).toString('hex');
 const {data:guest,error}=await db.from('guests').insert({...body,task_ids:undefined,manage_code:code}).select('id').single(); if(error)throw error;
 if(body.task_ids.length){const {error:e}=await db.from('task_signups').insert(body.task_ids.map(task_id=>({guest_id:guest.id,task_id})));if(e)throw e}
 return NextResponse.json({code});}catch(e:any){return NextResponse.json({error:e?.issues?.[0]?.message||e.message||'Unable to save RSVP.'},{status:400})}}
