# Supabase Setup Guide

This guide will help you set up Supabase for your portfolio website.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with GitHub/Google
4. Create a new project:
   - Choose your organization
   - Project name: `portfolio-website`
   - Database password: Generate a strong password
   - Region: Choose closest to your users
5. Wait for the project to be created (2-3 minutes)

## 2. Get Environment Variables

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

## 4. Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire contents of `database-schema.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the schema

This will create all tables and insert sample data.

## 5. Verify Setup

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. You should see:
   - Loading states while data is being fetched
   - Your portfolio content displayed from Supabase
   - Contact form should work (test it!)

## 6. Database Tables Created

The schema creates these tables:

- **profiles** - Your personal information
- **skills** - Technical skills with proficiency levels
- **projects** - Portfolio projects
- **project_tags** - Tags for projects (many-to-many)
- **experience** - Work experience timeline
- **certifications** - Professional certifications
- **quotes** - Motivational quotes (auto-cleanup after 7 days)
- **messages** - Contact form submissions

## 7. Sample Data

The schema includes sample data so you can see the portfolio working immediately. You can:

- Update the existing data in Supabase dashboard
- Add new projects, skills, experience
- Remove sample data and add your own

## 8. Security Features

The schema includes:

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** for portfolio content
- **Admin policies** for authenticated users (for future admin panel)
- **Message insertion** allowed for contact form

## 9. Next Steps

After setup, you can:

1. **Customize Content**: Update the sample data in Supabase dashboard
2. **Add Admin Panel**: Build authentication-protected admin routes
3. **Quotes API**: Set up automatic quote fetching from external APIs
4. **Deploy**: Deploy to Vercel with environment variables

## Troubleshooting

### "No data showing" error
- Check your `.env.local` file has correct values
- Verify Supabase project is active
- Check SQL schema was executed successfully

### "CORS error" in browser
- Make sure you're using `NEXT_PUBLIC_` prefix for environment variables
- Check Supabase CORS settings in dashboard

### "Permission denied" errors
- Verify RLS policies are correctly set up
- Check that tables exist and have data

## Support

If you encounter issues:

1. Check Supabase logs in **Settings** → **Logs**
2. Verify network connectivity
3. Check browser console for specific error messages
4. Ensure all environment variables are set correctly
