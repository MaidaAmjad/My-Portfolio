# Alex Rivera Portfolio

A modern, responsive portfolio website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern UI with glass morphism effects
- 🌙 Dark/Light mode support
- 📱 Fully responsive design
- ⚡ Performance optimized with Next.js 14 App Router
- 🎯 Component-based architecture
- 🔧 TypeScript for type safety
- 🎭 Tailwind CSS for styling
- 🗄️ **Supabase integration for dynamic content**
- 📝 **Working contact form with database storage**
- 🔄 **Dynamic quotes system with auto-cleanup**

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols
- **Fonts**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)

### 1. Clone and Install

1. Clone the repository:
```bash
git clone <repository-url>
cd myPortfolio
```

2. Install dependencies:
```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your Project URL and anon key from Settings → API
3. Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the database schema:
   - Open Supabase SQL Editor
   - Copy contents of `database-schema.sql`
   - Execute the script

📖 **Detailed setup guide**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 3. Run Development Server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── SkillsSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ExperienceSection.tsx
│   ├── CertificationsSection.tsx
│   ├── QuoteSection.tsx
│   ├── ContactSection.tsx
│   └── Footer.tsx
├── lib/                   # Utility libraries
├── hooks/                 # Custom React hooks
├── services/              # API services
├── types/                 # TypeScript type definitions
└── admin/                 # Admin dashboard (future)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (for future integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Future Enhancements

- [ ] Supabase integration for dynamic content
- [ ] Admin dashboard for content management
- [ ] Contact form functionality
- [ ] Motivational quotes API integration
- [ ] Blog section
- [ ] Project filtering and search
- [ ] Analytics integration

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push
5. Open a pull request

## License

© 2024 Alex Rivera. All rights reserved.
