# Tish's Nesting Party App

A complete mobile-friendly RSVP, arrival-time, task sign-up, private confirmation, and host-dashboard web app.

## Included
- Invitation-inspired public landing page
- Guest RSVP with arrival/departure times
- Task claiming with remaining spots
- Private guest management/cancellation link
- Password-protected host dashboard
- Guest schedule and task-coverage view
- Supabase/PostgreSQL schema and starter tasks
- Ready for GitHub and Vercel

## 1. Create the database
1. Create a free Supabase project.
2. Open **SQL Editor**.
3. Paste and run `supabase/schema.sql`.
4. In **Project Settings → API**, copy the project URL and service-role key.

Never expose the service-role key publicly. This project uses it only in server-side routes.

## 2. Configure locally
Copy `.env.example` to `.env.local` and fill in the values.

```bash
npm install
npm run dev
```
Open http://localhost:3000.

## 3. Put it on GitHub
Create an empty GitHub repository, then from this project folder:

```bash
git init
git add .
git commit -m "Initial nesting party app"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## 4. Host on Vercel
1. Sign in to Vercel with GitHub.
2. Import the repository.
3. Add all variables from `.env.example` under **Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to your final Vercel URL.
5. Deploy.

## Customize
- Invitation image: `public/invitation.png`
- Party text/date: `app/page.tsx`
- Available times: `components/RsvpForm.tsx`
- Starter tasks: edit in Supabase's Table Editor after running the SQL
- Exact location shown after RSVP: `app/manage/[code]/page.tsx`

## Security notes
- The Supabase service-role key stays server-side.
- Database tables have Row Level Security enabled and no anonymous public policies.
- Admin access uses a signed, HTTP-only cookie.
- Use a strong `ADMIN_PASSWORD` and `ADMIN_COOKIE_SECRET`.
