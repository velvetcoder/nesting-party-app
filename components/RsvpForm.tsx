'use client';
import { useMemo, useState } from 'react';

type Task = { id:string; title:string; description:string|null; category:string; helpers_needed:number; claimed:number };
export default function RsvpForm({ tasks }: { tasks: Task[] }) {
  const [selected,setSelected]=useState<string[]>([]); const [message,setMessage]=useState(''); const [loading,setLoading]=useState(false);
  const groups=useMemo(()=>Object.groupBy(tasks,t=>t.category),[tasks]);
  function toggle(id:string){setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setMessage(''); const form=new FormData(e.currentTarget);
    const body={name:form.get('name'),email:form.get('email'),phone:form.get('phone'),party_size:Number(form.get('party_size')||1),arrival_time:form.get('arrival_time'),departure_time:form.get('departure_time'),notes:form.get('notes'),task_ids:selected};
    const res=await fetch('/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const data=await res.json(); setLoading(false);
    if(!res.ok){setMessage(data.error||'Something went wrong.');return} window.location.href=`/manage/${data.code}`;
  }
  return <form onSubmit={submit} className="card">
    <h2 style={{marginTop:0}}>Reserve your spot</h2><div className="formgrid">
      <div className="field"><label>Name *</label><input name="name" required/></div>
      <div className="field"><label>Email *</label><input name="email" type="email" required/></div>
      <div className="field"><label>Phone</label><input name="phone" type="tel"/></div>
      <div className="field"><label>Number attending</label><input name="party_size" type="number" min="1" max="8" defaultValue="1"/></div>
      <div className="field"><label>Arrival time *</label><select name="arrival_time" required defaultValue=""><option value="" disabled>Select</option>{['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM'].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="field"><label>Departure time *</label><select name="departure_time" required defaultValue=""><option value="" disabled>Select</option>{['11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="field full"><label>Note for Tish</label><textarea name="notes" rows={3} placeholder="Food allergies, supplies you can bring, or anything else…"/></div>
    </div>
    <h2>Choose what you’d like to help with</h2><p className="meta">Pick one or more tasks, or leave them blank and we’ll place you where help is needed.</p>
    {Object.entries(groups).map(([category,list])=><div key={category}><h3>{category}</h3><div className="grid">{list!.map(task=>{const full=task.claimed>=task.helpers_needed;return <label className="card task" key={task.id} style={{opacity:full?.55:1}}><input type="checkbox" disabled={full} checked={selected.includes(task.id)} onChange={()=>toggle(task.id)}/><span><strong>{task.title}</strong><br/><span className="meta">{task.description}</span><br/><span className="meta">{Math.max(0,task.helpers_needed-task.claimed)} spot(s) left</span></span></label>})}</div></div>)}
    {message&&<p className="notice error">{message}</p>}<div className="actions"><button className="btn" disabled={loading}>{loading?'Saving…':'Count me in'}</button></div>
  </form>
}
