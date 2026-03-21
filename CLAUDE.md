# CLAUDE.md — Andrew CRM (CEO Operating System)

> **Read this entire file before writing any code.** This is the architecture bible for this codebase. Every agent pass — build, review, test, deploy — must comply with these rules. If something contradicts this file, this file wins.

---

## What This App Is

Andrew CRM is a personal CEO operating system that centralizes daily operations across three businesses:

- **Lucky's Concrete** — concrete services with 30+ city microsites
- **ZAS** — web agency managing multiple client sites
- **YRTX (Young Republicans of Texas)** — political org, digital presence

It is NOT a generic CRM. It is a single-user command center for one person (Andrew) to monitor projects, delegate to AI agents, track SEO, manage web team tasks, parse voice memos, and stay on top of email/calendar across all three companies from one interface.

**There is NO payments module.** Andrew manages payments directly in Stripe. Do not add Stripe, Zelle, PayPal, or any payment integration anywhere in this app.

---

## Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Frontend | Vite + React + React Router + Zustand + Tailwind CSS | UI |
| Backend | Supabase (Postgres, Auth, Edge Functions, Storage) | Data + API + Auth |
| Hosting | Railway (auto-deploy from GitHub on push to `main`) | Deployment |
| Version Control | GitHub | Code + agent trigger |
| Fonts | Google Fonts — Outfit (body) + IBM Plex Mono (mono) | Typography |

**No other services.** No Vercel, no Netlify, no Firebase, no extra middleware. Same stack as the Lucky's Ops Platform. Keep it simple.

### Key Dependencies

```
react, react-dom, react-router-dom
zustand (state management)
@supabase/supabase-js
tailwindcss
```

Do not add new dependencies without explicit approval. If you think you need a library, check if Zustand, Supabase, or vanilla JS can handle it first.

---

## Project Structure

```
andrew-crm/
├── CLAUDE.md                          ← You are here
├── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
│
├── public/
│   ├── manifest.json                  ← PWA manifest
│   └── favicon.ico
│
├── src/
│   ├── main.jsx                       ← Entry point, router setup
│   ├── App.jsx                        ← Shell (sidebar, header, routing)
│   │
│   ├── components/
│   │   ├── Shell.jsx                  ← Layout: sidebar + header + content area
│   │   ├── Sidebar.jsx                ← Collapsible nav with grouped modules
│   │   ├── Header.jsx                 ← Module title, hamburger, agents indicator
│   │   ├── MobileBottomNav.jsx        ← 5-tab bottom bar for mobile
│   │   └── ui/                        ← Shared primitives
│   │       ├── Pill.jsx               ← Status/tag badges
│   │       ├── Dot.jsx                ← Color indicator dots
│   │       ├── Bar.jsx                ← Progress bars
│   │       ├── StatCard.jsx           ← Metric display cards
│   │       ├── Tabs.jsx               ← Filter tab rows
│   │       ├── Row.jsx                ← Clickable list rows
│   │       └── Section.jsx            ← Section headers with counts
│   │
│   ├── modules/
│   │   ├── BriefingModule.jsx         ← Morning digest
│   │   ├── ProjectsModule.jsx         ← Project board (all companies)
│   │   ├── WebTeamModule.jsx          ← Task queue for web designers
│   │   ├── SitesModule.jsx            ← SEO health dashboard (Ahrefs data)
│   │   ├── YRTXModule.jsx             ← YRTX keyword tracker + ads
│   │   ├── EmailModule.jsx            ← Gmail integration (andrew@zas.llc)
│   │   ├── CalendarModule.jsx         ← Unified schedule
│   │   ├── VoiceModule.jsx            ← Plaud voice memos → parsed tasks
│   │   ├── AgentsModule.jsx           ← Agent Monitor (real-time dashboard)
│   │   ├── AgentSettings.jsx          ← Agent configuration toggles
│   │   └── LuckysModule.jsx           ← Lucky's quick-access link
│   │
│   ├── pages/
│   │   └── Submit.jsx                 ← Phone intake page (PWA-ready)
│   │
│   ├── lib/
│   │   ├── supabase.js                ← Supabase client init
│   │   ├── theme.js                   ← Theme context, LIGHT/DARK tokens
│   │   └── constants.js               ← Module definitions, nav groups
│   │
│   └── stores/
│       ├── useProjects.js             ← Zustand store for projects
│       ├── useAgentJobs.js            ← Zustand store for agent jobs (realtime)
│       ├── useVoiceMemos.js           ← Zustand store for voice memos
│       └── useSettings.js             ← Zustand store for agent settings
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 001_agent_jobs.sql
│   │   ├── 002_agent_settings.sql
│   │   ├── 003_projects.sql
│   │   ├── 004_web_tasks.sql
│   │   ├── 005_voice_memos.sql
│   │   └── 006_sites.sql
│   └── functions/
│       ├── submit-job/index.ts        ← Phone intake → GitHub Issue
│       ├── agent-callback/index.ts    ← Agent completion → update job status
│       └── plaud-webhook/index.ts     ← Plaud/Zapier → voice_memos (future)
│
├── scripts/
│   └── generate-state.js             ← Codebase state doc → Google Drive
│
└── .github/
    └── workflows/
        ├── claude-agent.yml           ← Code: build → review → test → deploy
        ├── claude-content.yml         ← Content: research → write → edit → publish
        ├── claude-seo.yml             ← SEO: audit → analyze → implement → verify
        └── claude-scheduled.yml       ← Cron: morning briefing, rank checks, reports
```

---

## Design System

### Theme

Light mode is the **default**. Dark mode is available via toggle. Both themes are defined as flat token objects and provided via React Context (`ThemeCtx`).

**Light Theme:**

```javascript
{
  bg: "#f4f5f7",        // Page background
  surface: "#ffffff",    // Surface layer
  card: "#ffffff",       // Card backgrounds
  raised: "#f0f1f3",    // Elevated/hover backgrounds
  border: "#e0e2e6",    // Default borders
  borderHover: "#ccd0d5",
  borderActive: "#b0b5bc",
  text: "#1a1d23",       // Primary text
  text2: "#4a4f5a",      // Secondary text
  text3: "#8a8f9a",      // Tertiary/muted text
  text4: "#b5bac5",      // Quaternary/disabled text
  amber: "#d08520",      // Brand accent (primary action color)
  amberDim: "#a06800",
  amberBg: "rgba(208,133,32,0.08)",
  amberBorder: "rgba(208,133,32,0.22)",
  orange: "#d06020",     // Lucky's brand
  blue: "#2a70d0",       // ZAS brand
  green: "#1a9050",      // Success / active
  red: "#d03030",        // YRTX brand / error / urgent
  purple: "#7c50d0",     // Voice / personal
  cyan: "#1a9090",       // Agent Monitor accent
  luckys: "#d06020",     // Company: Lucky's
  zas: "#2a70d0",        // Company: ZAS
  yrtx: "#d03030",       // Company: YRTX
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  navBg: "#ffffff",
  navActive: "rgba(208,133,32,0.10)",
  headerBg: "#ffffff",
  inputBg: "#f4f5f7",
  codeBg: "#f0f1f3",
}
```

**Dark Theme:**

```javascript
{
  bg: "#080808",
  surface: "#111111",
  card: "#161616",
  raised: "#1c1c1c",
  border: "#252525",
  borderHover: "#333333",
  borderActive: "#444444",
  text: "#e8e8e8",
  text2: "#a0a0a0",
  text3: "#666666",
  text4: "#444444",
  amber: "#f0a030",
  amberDim: "#a06800",
  amberBg: "rgba(240,160,48,0.07)",
  amberBorder: "rgba(240,160,48,0.18)",
  orange: "#f07030",
  blue: "#4090f0",
  green: "#40c070",
  red: "#f04040",
  purple: "#a070f0",
  cyan: "#40d0d0",
  luckys: "#f07030",
  zas: "#4090f0",
  yrtx: "#f04040",
  shadow: "0 1px 3px rgba(0,0,0,0.3)",
  navBg: "#111111",
  navActive: "rgba(240,160,48,0.08)",
  headerBg: "#111111",
  inputBg: "#1c1c1c",
  codeBg: "#0a0a0a",
}
```

### Typography

- **Body:** `'Outfit', sans-serif` — all UI text, labels, headings
- **Mono:** `'IBM Plex Mono', monospace` — numbers, timestamps, code logs, metrics

Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Border Radii

```javascript
const R = { lg: 14, md: 10, sm: 6 };
```

- `lg` (14px) — Feature cards, banners, module headers
- `md` (10px) — Standard cards, rows, inputs
- `sm` (6px) — Pills, badges, tabs, small elements

### Company Color Mapping

Every piece of data in the CRM is tagged to a company. Use these colors consistently:

| Company | Token | Light | Dark | Label |
|---------|-------|-------|------|-------|
| Lucky's Concrete | `luckys` | `#d06020` | `#f07030` | "Lucky's" |
| ZAS | `zas` | `#2a70d0` | `#4090f0` | "ZAS" |
| YRTX | `yrtx` | `#d03030` | `#f04040` | "YRTX" |
| Personal | `purple` | `#7c50d0` | `#a070f0` | "Personal" |

### Status Colors

| Status | Color Token | Usage |
|--------|-------------|-------|
| Active / Success | `green` | Active projects, completed jobs, approved tasks |
| Warning / Stalled | `amber` | Stalled projects, pending items, due today |
| Error / Urgent | `red` | Overdue, failed jobs, urgent priority |
| Neutral / Queued | `text3` | Backlog, queued, low priority |
| Building / Info | `blue` | In-progress agent jobs, informational |
| Reviewing | `purple` | Agent review pass, voice memos |
| Agent Monitor | `cyan` | Agent Monitor module accent |

---

## Shell & Navigation

### Sidebar (Desktop)

- **Position:** Fixed left, full viewport height
- **Width:** 200px expanded, 56px collapsed (icon-only with tooltips)
- **Toggle:** ☰ hamburger in header OR ◂/▸ button at sidebar bottom
- **Grouped sections:** Daily, Work, Campaigns, Communications, System, Companies
- **Collapsed mode:** Group headers become thin separator lines, icons centered, hover shows tooltip with label + badge count
- **Active state:** `navActive` background + `amber` text color
- **Badge counts:** Red for urgent items (unread email, unassigned tasks, pending voice tasks), green for agents active
- **Footer:** Version label, dark mode toggle (🌙/☀️), collapse toggle

### Sidebar (Mobile)

- **Position:** Fixed overlay drawer, opens from the LEFT side
- **Width:** 250px
- **Trigger:** ☰ hamburger in header
- **Backdrop:** Semi-transparent overlay, tap to close
- **Z-index:** 100 (drawer), 90 (backdrop)

### Header

- **Position:** Sticky top
- **Contents:** ☰ hamburger toggle, module icon, module label, flex spacer, "agents active" indicator
- **Agents indicator:** Pulsing green dot + count, **clickable** — navigates to Agent Monitor module
- **Only shows when agents are actively running** (status: building, reviewing, testing, deploying)

### Mobile Bottom Nav

- **Position:** Fixed bottom, 5 tabs
- **Tabs:** Briefing, Projects, Agents, Email, Calendar
- **Active state:** Full opacity icon + amber label
- **Badge dots** on tabs with urgent counts
- **Safe area:** `padding-bottom: env(safe-area-inset-bottom, 6px)` for notched phones

---

## Modules (10 Total)

### Module Registry

```javascript
const MODULES = [
  { id: "briefing",  label: "Briefing",  icon: "☀️", group: "daily" },
  { id: "projects",  label: "Projects",  icon: "📋", group: "work" },
  { id: "webteam",   label: "Web Team",  icon: "🎨", group: "work" },
  { id: "sites",     label: "Sites",     icon: "🌐", group: "work" },
  { id: "yrtx",      label: "YRTX",      icon: "🏛️", group: "campaigns" },
  { id: "email",     label: "Email",     icon: "✉️", group: "comms" },
  { id: "calendar",  label: "Calendar",  icon: "📅", group: "comms" },
  { id: "voice",     label: "Voice",     icon: "🎙️", group: "comms" },
  { id: "agents",    label: "Agents",    icon: "🤖", group: "system" },
  { id: "luckys",    label: "Lucky's",   icon: "🍀", group: "companies" },
];

const GROUPS = {
  daily: "Daily",
  work: "Work",
  campaigns: "Campaigns",
  comms: "Communications",
  system: "System",
  companies: "Companies",
};
```

### 1. Morning Briefing (`briefing`)

Auto-generated daily digest. Pulls data from all other modules to give Andrew a single screen overview each morning.

**Sections:**
- Greeting banner with date and active agent count
- Stat cards row: Unread Email, Stalled Projects, Active Agents, Pending Voice Tasks
- Today's Schedule (from Calendar, color-coded by company)
- Agents Working (active jobs with stage progress)
- Stalled Projects (projects with `status: "stalled"`, progress bars)

**Data sources:** `events`, `agent_jobs`, `projects`, `emails`, `voice_memos`

### 2. Projects (`projects`)

Kanban-style project board across all companies. Each project card shows name, company tag, status (active/stalled/backlog), progress bar, task count, assignee, due date.

**Filters:** All, Stalled, Lucky's, ZAS, YRTX
**Sort:** By status (active → stalled → backlog)
**Stat cards:** Active count, Stalled count, Backlog count

### 3. Web Team Tasks (`webteam`)

Task assignment queue for web designers and agents.

**Views:** To Do, In Progress, Backlog, All
**Each task:** Priority indicator (color bar), task description, target site, assignee (or "Unassigned"), priority pill, due date
**Summary bar:** Unassigned count (amber), Agent-assigned count (green), status breakdown

### 4. Sites (`sites`)

SEO health dashboard for the full site portfolio (50+ sites, 10 tracked with detail).

**Sorts:** By Status, By Traffic, By DR
**Each site:** Domain (mono font), DR, keyword count, traffic estimate, trend arrow, status pill
**Stat cards:** Total Sites, Tracked count, Need Attention count
**Status levels:** Healthy (green), Attention (red), Needs Work (amber), New (blue)
**Data source:** Ahrefs API (via scheduled agent jobs syncing to Supabase)

### 5. YRTX Campaign (`yrtx`)

SEO keyword tracker + Google Ads metrics for yrtx.gop.

**Header:** YRTX branding with DR, Ref Domains, Organic Keywords, Tracked Keywords
**Keyword table:** Keyword, Volume, Position, Change (Δ), Keyword Difficulty
- Ranked keywords highlighted (green ≤10, amber >10)
- Unranked keywords dimmed
**Data source:** Ahrefs API

### 6. Email (`email`)

Gmail integration for `andrew@zas.llc`.

**Filters:** All, Unread, Lucky's, ZAS, YRTX
**Each email:** Company dot, sender, subject, time, unread bold styling, actionable badge
**Expanded actions:** Reply, → Task, → Web Team, → Agent Job
**Data source:** Gmail API via Supabase Edge Function

### 7. Calendar (`calendar`)

Unified schedule view.

**Day strip:** Horizontal scrollable 10-day strip with today highlighted in amber
**Today's events:** Full event cards with company color left-border, title, time range, company pill
**Data source:** Google Calendar API

### 8. Voice Inbox (`voice`)

Plaud voice memos → parsed action items. This is a FUTURE FEATURE (see `Feature-Idea_Plaud-Voice-Inbox-Integration.md` for full spec).

**Current UI (ready for data):**
- Header with pending task count
- Each memo card: timestamp, duration, transcript (italic), "VOICE MEMO" pill
- Parsed tasks section below transcript: company dot, task text, Approve button or "APPROVED" pill
- Tasks route to appropriate board on approval

**Future integration paths:**
1. Zapier (quick): Plaud transcription → Zapier webhook → Supabase Edge Function → `voice_memos` table
2. Plaud Developer Platform (full): Custom extraction schemas, structured JSON output, direct webhook

### 9. Agent Monitor (`agents`)

**This is the centerpiece of the remote agent system.** Real-time dashboard for all Claude Code agent jobs.

**Views:** Active, Queue, Done, All
**Stat cards:** Active count, Queued count, Today $ cost, Week $ cost

**Job card anatomy:**
- Type icon + type pill + company pill
- Job title (bold)
- Target site/repo + start time
- Status pill (Queued / Building / Reviewing / Testing / Deploying / Complete / Failed)
- Progress bar showing stage completion (e.g., "Stage 3/6")
- Elapsed time (mono font)

**Expanded job view (click to expand):**
- **Active jobs:** Railway-style staged pipeline view
  - Vertical timeline with connected nodes
  - Each stage: status indicator (✓ complete / ● pulsing active / ○ pending), name, elapsed duration
  - Collapsible per-stage log output (monospace, line-numbered)
  - Active stage auto-expands
  - Action buttons: Full Logs, Cancel Job
- **Queued jobs:** Move to Top, Cancel buttons
- **Completed jobs:** View PR, View Logs, Rollback buttons + result summary

**Stage definitions by job type:**

| Type | Stages |
|------|--------|
| Code | Setup → Analyze → Implement → Review → Test → Deploy |
| Design | Setup → Analyze Current → Generate Mockup → Review & Iterate → Implement → Deploy |
| Content | Research → Outline → Write → Edit → Optimize Meta → Publish |
| SEO | Audit → Analyze → Generate Fixes → Implement → Verify |
| Batch | Setup → Scan Sites → Generate Changes → Preview First → Apply All → Verify |
| Report | Gather Data → Analyze → Format → Deliver |

**New Job Submission:** Dashed-border card at bottom with type buttons (Code, Design, Content, SEO, Batch)

**Agent Settings Panel** (accessed via ⚙️ button):
- Code & Features: auto-deploy, require review, require tests, auto-rollback
- Website Redesigns: require approval, generate mockup first, before/after screenshots
- Content Generation: auto-publish, save as WP draft, require editorial review, auto meta tags, auto internal links
- SEO & Ahrefs: daily rank check, weekly traffic audit, auto-flag drops >20%, auto-fix meta, auto-add schema
- Bulk — Lucky's Sites: require approval before batch, preview first site, monthly NAP check, SSL monitoring
- Business Ops: morning briefing 6 AM, weekly report Friday
- Notifications: notify on start/progress/complete/failure
- Budget: enable limits ($10/day, $50/week)

All settings stored in `agent_settings` Supabase table, read by GitHub Action workflows.

### 10. Lucky's Link (`luckys`)

Quick-access portal to the Lucky's Ops Platform (separate app at `app.luckysconcrete.org`).

**Contents:** Lucky's branding header, project cards for Lucky's-tagged projects, "Open Full Lucky's Platform →" button
**This is a link/summary module, not a duplicate of the Lucky's app.**

---

## Supabase Database Schema

### Table: `agent_jobs`

```sql
CREATE TABLE agent_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('code', 'content', 'seo', 'design', 'report', 'batch')),
  target TEXT NOT NULL,
  company TEXT NOT NULL CHECK (company IN ('luckys', 'zas', 'yrtx', 'personal')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'building', 'reviewing', 'testing', 'deploying', 'complete', 'failed')),
  github_issue_url TEXT,
  github_pr_url TEXT,
  result_url TEXT,
  result_summary TEXT,
  agent_passes INTEGER DEFAULT 0,
  stages JSONB DEFAULT '[]',
  elapsed_seconds INTEGER DEFAULT 0,
  token_cost INTEGER DEFAULT 0,
  error_log TEXT,
  approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ
);

-- Enable realtime for Agent Monitor live updates
ALTER PUBLICATION supabase_realtime ADD TABLE agent_jobs;

-- Index for dashboard queries
CREATE INDEX idx_agent_jobs_status ON agent_jobs (status);
CREATE INDEX idx_agent_jobs_company ON agent_jobs (company);
CREATE INDEX idx_agent_jobs_created ON agent_jobs (created_at DESC);
```

### Table: `agent_settings`

```sql
CREATE TABLE agent_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed defaults
INSERT INTO agent_settings (category, key, value) VALUES
  ('code', 'code_auto_deploy', 'false'),
  ('code', 'code_review', 'true'),
  ('code', 'code_tests', 'true'),
  ('code', 'code_rollback', 'true'),
  ('design', 'design_approval', 'true'),
  ('design', 'design_mockup', 'true'),
  ('design', 'design_screenshots', 'true'),
  ('content', 'content_auto_publish', 'false'),
  ('content', 'content_drafts', 'true'),
  ('content', 'content_review', 'true'),
  ('content', 'content_meta', 'true'),
  ('content', 'content_links', 'true'),
  ('seo', 'seo_daily_rank', 'true'),
  ('seo', 'seo_weekly_traffic', 'true'),
  ('seo', 'seo_flag_drops', 'true'),
  ('seo', 'seo_auto_fix', 'false'),
  ('seo', 'seo_auto_schema', 'false'),
  ('bulk', 'bulk_approval', 'true'),
  ('bulk', 'bulk_preview', 'true'),
  ('bulk', 'bulk_nap', 'true'),
  ('bulk', 'bulk_ssl', 'true'),
  ('ops', 'ops_briefing', 'true'),
  ('ops', 'ops_weekly', 'true'),
  ('notif', 'notif_start', 'false'),
  ('notif', 'notif_progress', 'false'),
  ('notif', 'notif_complete', 'true'),
  ('notif', 'notif_failure', 'true'),
  ('budget', 'budget_enabled', 'true');
```

### Table: `projects`

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  company TEXT NOT NULL CHECK (company IN ('luckys', 'zas', 'yrtx', 'personal')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stalled', 'backlog', 'complete')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  due_date TEXT,
  assignee TEXT
);
```

### Table: `web_tasks`

```sql
CREATE TABLE web_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  task TEXT NOT NULL,
  site TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'backlog', 'done')),
  assignee TEXT DEFAULT 'Unassigned',
  due_date TEXT
);
```

### Table: `voice_memos` (Future — Plaud integration)

```sql
CREATE TABLE voice_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_at TIMESTAMPTZ,
  transcript TEXT,
  summary TEXT,
  audio_url TEXT,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived')),
  company TEXT,
  extracted_tasks JSONB DEFAULT '[]',
  tasks_generated BOOLEAN DEFAULT FALSE,
  plaud_recording_id TEXT UNIQUE
);
```

### Table: `sites`

```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  dr INTEGER DEFAULT 0,
  keywords INTEGER DEFAULT 0,
  traffic INTEGER DEFAULT 0,
  trend TEXT DEFAULT 'flat' CHECK (trend IN ('up', 'down', 'flat')),
  company TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('healthy', 'attention', 'needs_work', 'new')),
  last_synced TIMESTAMPTZ
);
```

---

## Agent Pipeline Architecture

### How Agents Run

All agents execute via **GitHub Actions** using `anthropics/claude-code-action@v1`. No additional infrastructure needed.

```
Phone/CRM (intake) → Supabase Edge Function → GitHub Issue (labeled)
                                                      ↓
                                              GitHub Action triggers
                                              (Claude Code Agent)
                                                      ↓
                                          Multi-stage pipeline runs
                                          (build → review → test)
                                                      ↓
                                              Auto-merge → main
                                                      ↓
                                          Railway auto-deploys
                                                      ↓
                                          generate-state.js → Google Drive
                                                      ↓
                                          agent-callback → Supabase
                                          (update job status)
                                                      ↓
                                          Notification (Slack/push)
```

### Job Submission Flow

1. Andrew submits request (phone intake page, CRM Agent Monitor, or Claude web conversation)
2. Supabase Edge Function (`submit-job`) receives request, inserts into `agent_jobs` table, creates GitHub Issue with label
3. GitHub Action triggers on issue creation with matching label
4. Agent pipeline runs (stages depend on job type)
5. On completion, agent calls `agent-callback` Edge Function to update `agent_jobs`
6. CRM Agent Monitor shows real-time progress via Supabase Realtime subscriptions
7. Notification sent via Slack webhook
8. `generate-state.js` runs, pushes `CODEBASE_STATE.md` to Google Drive

### GitHub Issue Labels → Pipeline

| Label | Workflow File | Pipeline |
|-------|--------------|----------|
| `claude-build` | `claude-agent.yml` | Code: build → review → test → deploy |
| `claude-content` | `claude-content.yml` | Content: research → write → edit → publish |
| `claude-seo` | `claude-seo.yml` | SEO: audit → analyze → implement → verify |
| `claude-design` | `claude-agent.yml` | Design: mockup → review → implement → deploy |
| `claude-report` | `claude-scheduled.yml` | Report: gather → analyze → format → deliver |
| `claude-batch` | `claude-agent.yml` | Batch: iterate sites → apply → verify each |

### Parallel Agent Limits

- Code jobs: Max 3 concurrent (avoid merge conflicts)
- Content jobs: Max 5 concurrent (independent)
- SEO/audit jobs: Max 5 concurrent (read-only)
- Batch jobs: Max 1 (sequential)
- Reports: Max 3 concurrent

### Scheduled Agents (Cron)

| Schedule | Job | Description |
|----------|-----|-------------|
| Daily 6:00 AM CT | Morning Briefing | Query all data, generate digest, notify |
| Daily 7:00 AM CT | YRTX Rank Check | Pull keyword positions from Ahrefs, update CRM |
| Weekly Monday | Site Portfolio Sync | Pull DR/traffic/keywords for all Ahrefs projects |
| Weekly Monday | Content Queue Refill | Check which sites need content, generate job queue |
| Weekly Friday | Business Report | Aggregate week's activity across all companies |
| Monthly 1st | Bulk Site Audit | Lighthouse + Ahrefs on all 50+ sites |
| Monthly 1st | SSL/Plugin Check | Verify SSL + pending plugin updates (WPMUDEV) |

---

## Phone Intake Page

**Route:** `/submit`
**Design:** Single screen, mobile-optimized, bookmarkable to home screen (PWA manifest)
**Auth:** None (Andrew is the only user)

**Fields:**
- Text area: "What needs to happen?" (required)
- Type selector: Code / Content / Design / SEO / Batch / Report
- Priority selector: High / Medium / Low

**On submit:**
1. POST to Supabase Edge Function (`submit-job`)
2. Edge Function inserts into `agent_jobs` (status: queued)
3. Edge Function creates GitHub Issue with appropriate label
4. User gets confirmation: "Job submitted — tracking in Agent Monitor"
5. GitHub Action picks up the issue and starts the pipeline

---

## Codebase State Sync

After every successful deploy, `generate-state.js` runs as the final GitHub Action step:

1. Generates `CODEBASE_STATE.md` containing:
   - File tree (components, modules, lib, pages)
   - Supabase schema (tables, columns, row-level info)
   - Design tokens (current theme values)
   - Package versions
   - Last 5 deploys with PR numbers
   - Current git hash
2. Uploads to Google Drive: `/Codebase States/andrew-crm/`
3. Claude web project instruction: "Before making code changes, search Google Drive for the latest Codebase State doc and read it first."

This keeps Claude web conversations in sync with the live deployed codebase.

---

## External Integrations

| Service | Integration Method | Used By |
|---------|-------------------|---------|
| Ahrefs | API (via scheduled agents) | Sites module, YRTX module, SEO agents |
| Gmail | Gmail API (via Supabase Edge Function) | Email module |
| Google Calendar | Calendar API | Calendar module |
| WordPress/WPMUDEV | REST API + WP Pusher (Git deploy) | Content agents, design agents, batch agents |
| Plaud | Zapier webhook → Edge Function (Phase 1), Developer Platform API (Phase 2) | Voice module (future) |
| GitHub | Actions API + Issues API | Agent system |
| Google Drive | Drive API | State sync |
| Slack | Webhook | Notifications |

---

## What NOT to Do

1. **Do NOT add a payments module.** No Stripe, Zelle, PayPal, or any payment-related feature.
2. **Do NOT add new npm dependencies** without explicit approval.
3. **Do NOT use localStorage.** Use Zustand for client state, Supabase for persistent state.
4. **Do NOT use inline styles for new components.** The mockup uses inline styles — production code uses Tailwind CSS classes. When converting from mockup to production, translate inline styles to Tailwind.
5. **Do NOT create separate CSS files.** Tailwind only.
6. **Do NOT change the theme token values** without approval. They are tuned for both light and dark modes.
7. **Do NOT add multi-user features.** This is a single-user app for Andrew.
8. **Do NOT duplicate functionality** that exists in external tools (Stripe for payments, Ahrefs for raw SEO data, Close CRM for sales pipeline).
9. **Do NOT modify the deploy stack.** Supabase + Railway + GitHub. Nothing else.
10. **Do NOT skip the review pass** in agent pipelines. Every code change gets at minimum a build + review.

---

## Implementation Phases

### Phase 1 — Foundation (Week 1)
- [ ] Initialize GitHub repo (`andrew-crm`)
- [ ] Scaffold Vite + React + Router + Zustand + Tailwind
- [ ] Set up Supabase project (auth, tables, edge functions)
- [ ] Deploy to Railway from GitHub (auto-deploy on push to `main`)
- [ ] Create this `CLAUDE.md` with full architecture rules
- [ ] Install Claude GitHub App
- [ ] Set up `.github/workflows/claude-agent.yml` (basic build → review → deploy)
- [ ] Test: create GitHub Issue → watch agent build and deploy a small feature

### Phase 2 — Core Modules + Agent Monitor (Week 2)
- [ ] Build Shell (sidebar, header, routing, mobile bottom nav)
- [ ] Build Agent Monitor module (job cards, stage pipeline, logs, settings)
- [ ] Build phone intake page (`/submit`)
- [ ] Create `submit-job` and `agent-callback` Edge Functions
- [ ] Create `agent_jobs` and `agent_settings` tables
- [ ] Wire Agent Monitor to Supabase Realtime for live updates
- [ ] Test: submit job from phone → appears in Agent Monitor → agent runs → completes

### Phase 3 — Content & SEO Agents (Week 3)
- [ ] Build content generation pipeline (`claude-content.yml`)
- [ ] Build SEO audit pipeline (`claude-seo.yml`)
- [ ] Connect Ahrefs API for keyword data and site metrics
- [ ] WordPress REST API integration for draft post publishing
- [ ] Build Morning Briefing module
- [ ] Build Projects module
- [ ] Build Web Team Tasks module
- [ ] Test: submit "Write blog post for YRTX" → agent writes → drafts in WordPress

### Phase 4 — Dashboard Modules (Week 3-4)
- [ ] Build Sites module (Ahrefs data display)
- [ ] Build YRTX Campaign module (keyword tracker)
- [ ] Build Email module (Gmail integration)
- [ ] Build Calendar module (Google Calendar integration)
- [ ] Build Lucky's Link module
- [ ] Build scheduled workflows (morning briefing, rank checks)
- [ ] Test: scheduled jobs run on cron → data appears in CRM

### Phase 5 — State Sync + Drive Integration (Week 4)
- [ ] Build `generate-state.js` script
- [ ] Add Google Drive upload step to all deploy workflows
- [ ] Update Claude Project instructions for auto-pull
- [ ] Test: deploy feature → state doc updates in Drive → Claude web sees new code

### Phase 6 — Batch Operations + Voice (Week 5+)
- [ ] WPMUDEV API integration for bulk site management
- [ ] Batch update pipeline for Lucky's city sites
- [ ] WordPress theme deployment pipeline
- [ ] Site cloning agent for new Lucky's markets
- [ ] Voice Inbox: Zapier → Plaud webhook (Phase 1 of voice integration)
- [ ] Full portfolio audit automation (monthly)

---

## Reference Files

These files exist in the project and inform the build:

| File | What It Contains |
|------|-----------------|
| `andrew-crm-v3.jsx` | Full 10-module React/JSX mockup with working UI — use as the visual/behavioral reference for all modules |
| `Andrew-CRM-Full-Dev-Package.md` | Complete development specification with agent use cases, cost estimates, WordPress integration paths, and detailed settings breakdown |
| `Feature-Idea_Plaud-Voice-Inbox-Integration.md` | Voice Inbox integration spec — two paths (Zapier vs Plaud Developer Platform), Supabase schema, UI behavior, implementation sequence |

**The mockup (`andrew-crm-v3.jsx`) is the source of truth for how things should look and behave.** When in doubt about a UI decision, match the mockup.

---

## Cost Estimates

| Job Type | Avg Tokens | Approx Cost (Sonnet) | Frequency |
|----------|-----------|---------------------|-----------|
| Feature build (3-pass) | ~50k | ~$0.45 | 2-3/week |
| Blog post (4-pass) | ~30k | ~$0.27 | 5-10/week |
| SEO audit | ~20k | ~$0.18 | Weekly |
| Site speed fix | ~40k | ~$0.36 | As needed |
| Daily briefing report | ~10k | ~$0.09 | Daily |
| Bulk site update (30 sites) | ~100k | ~$0.90 | Monthly |
| Weekly business report | ~15k | ~$0.14 | Weekly |

**Estimated monthly cost:** $30–80 depending on volume.

Default budget limits: $10/day, $50/week (configurable in Agent Settings).
