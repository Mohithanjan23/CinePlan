# CinePlan
Dynamic Shoot-Planning for Modern Filmmakers &amp; Photographers

CinePlan is a productivity dashboard designed to streamline the pre-production workflow. It replaces scattered spreadsheets and notes with a unified interface for managing shot lists, gear, schedules, and weather conditions.

🌟 Key Features

🗂 Project Dashboard: Organize multiple shoots with high-level stats (Shots, Gear, Crew).

🤖 AI Copilot (Gemini): Generate creative shot lists instantly based on your project brief.

☀️ Live Weather Intelligence: Real-time forecasts, sunrise/sunset times, and Golden Hour tracking using Open-Meteo.

📋 Interactive Shot Lists: Track shots by scene, lens, and type. Toggle status as you shoot.

sombr Gear Locker: Manage equipment checklists with status tracking (Packed, Missing, In-Use).

📅 Schedule Builder: Drag-and-drop style timeline for logistics, shooting blocks, and breaks.

🛠 Tech Stack

Frontend

Framework: React 18 + Vite

Styling: Tailwind CSS

Icons: Lucide React

Backend (BaaS)

Database: Supabase (PostgreSQL)

Authentication: Supabase Auth

Serverless: Supabase Edge Functions (Deno)

External APIs

AI: Google Gemini Pro

Weather: Open-Meteo (Free, No Key Required)

🚀 Getting Started

1. Clone & Install

git clone [https://github.com/yourusername/cineplan.git](https://github.com/yourusername/cineplan.git)
cd cineplan
npm install



2. Configure Environment

Create a .env.local file in the root directory:

# Supabase Configuration
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key



3. Run Development Server

npm run dev



Open http://localhost:5173 to view the app.

🗄️ Backend Setup (Supabase)

To enable the full persistence layer (instead of the mock data used in the prototype), run the following SQL in your Supabase SQL Editor:

-- Projects Table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users not null,
  title text not null,
  client text,
  shoot_date date,
  location_name text,
  lat float, lng float,
  status text default 'planning',
  created_at timestamp with time zone default now()
);

-- Shots Table
create table public.shots (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  scene text,
  label text not null,
  shot_type text,
  lens text,
  priority text default 'Medium',
  status text default 'todo'
);



AI Edge Function Setup

To enable the "AI Suggest" feature securely:

Initialize Supabase locally: supabase init

Create function: supabase functions new generate-shots

Set secret: supabase secrets set GEMINI_API_KEY=your_google_key

Deploy: supabase functions deploy generate-shots

📱 Project Structure

src/
├── api/
│   ├── supabaseClient.js    # DB Connection
│   └── dataServices.js      # CRUD Operations
├── components/
│   ├── Card.jsx
│   ├── Badge.jsx
│   └── ...
├── hooks/
│   ├── useProjects.js       # Data fetching logic
│   ├── useWeather.js        # API integration
│   └── useAI.js             # Edge function wrapper
├── pages/
│   ├── Dashboard.jsx
│   └── ProjectView.jsx
└── App.jsx



🗺️ Roadmap

$$x$$

 Phase 1: MVP (Solo Planner, Weather, Basic Lists)

$$$$

 Phase 2: Collaboration (Real-time updates, Crew invites)

$$$$

 Phase 3: Documents (PDF Call Sheet Export)

$$$$

 Phase 4: Mobile (PWA for on-set offline use)

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
