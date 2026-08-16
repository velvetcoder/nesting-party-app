import Image from 'next/image';
import RsvpForm from '@/components/RsvpForm';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const db = getSupabaseAdmin();

    // Get all active tasks
    const { data: tasks, error: tasksError } = await db
        .from('tasks')
        .select('id, title, description, category, helpers_needed, sort_order')
        .eq('active', true)
        .order('sort_order');

    if (tasksError) {
        console.error('Error loading tasks:', tasksError);
    }

    // Get existing task signups separately
    const { data: signups, error: signupsError } = await db
        .from('task_signups')
        .select('task_id');

    if (signupsError) {
        console.error('Error loading task signups:', signupsError);
    }

    // Count how many people have claimed each task
    const signupCounts: Record<string, number> = {};

    (signups || []).forEach((signup: any) => {
        signupCounts[signup.task_id] =
            (signupCounts[signup.task_id] || 0) + 1;
    });

    // Add the claimed count to each task
    const clean = (tasks || []).map((task: any) => ({
        ...task,
        claimed: signupCounts[task.id] || 0,
    }));
  return <main><div className="shell">
    <section className="hero"><Image className="invite" src="/invitation.png" width={1050} height={1536} alt="Nesting party invitation" priority/><div>
      <div className="eyebrow">Saturday · October 3, 2026</div><h1 className="title">Prepare the <span className="script">nest</span></h1>
      <p className="lead">This is a hands-on celebration for Tish and baby. Choose when you’re coming and claim a small cleaning, organizing, baby-prep, or meal-prep task. We’ll work, snack, laugh, and leave the home feeling ready.</p>
      <div className="card"><strong>Location:</strong> Shared after you RSVP<br/><strong>What to wear:</strong> Comfortable clothes<br/><strong>What to bring:</strong> Just yourself—optional supplies are listed with tasks.</div>
      <div className="actions"><a className="btn" href="#signup">Sign up to help</a><a className="btn secondary" href="/admin">Host dashboard</a></div>
    </div></section>
    <section className="section"><div className="grid"><div className="card"><h3>1. Pick a time</h3><p className="meta">Tell us your arrival and departure window.</p></div><div className="card"><h3>2. Choose a task</h3><p className="meta">Claim the job that feels best for you.</p></div><div className="card"><h3>3. Bring good energy</h3><p className="meta">Food, music, and supplies will be coordinated.</p></div></div></section>
    <section id="signup" className="section"><RsvpForm tasks={clean}/></section>
  </div></main>
}
