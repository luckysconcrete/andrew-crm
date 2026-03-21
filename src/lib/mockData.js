export const PROJECTS = [
  { id: 1, name: "Lucky's Ops Platform v3", company: "luckys", status: "active", progress: 65, tasks: 18, done: 12, due: "Mar 30", assignee: "Andrew" },
  { id: 2, name: "YRTX SEO + Google Ads", company: "yrtx", status: "active", progress: 25, tasks: 15, done: 4, due: "Ongoing", assignee: "Andrew" },
  { id: 3, name: "Adams Clinic Redesign", company: "zas", status: "active", progress: 40, tasks: 12, done: 5, due: "Mar 20", assignee: "Web Team" },
  { id: 4, name: "Viscong SEO Overhaul", company: "zas", status: "stalled", progress: 10, tasks: 20, done: 2, due: "Apr 15", assignee: "Web Team" },
  { id: 5, name: "Highland Masonry Site", company: "zas", status: "active", progress: 70, tasks: 8, done: 6, due: "Mar 10", assignee: "Web Team" },
  { id: 6, name: "LPLoss Consulting Content", company: "zas", status: "stalled", progress: 15, tasks: 10, done: 1, due: "Mar 25", assignee: "Agent" },
  { id: 7, name: "Watch Trading Platform", company: "personal", status: "backlog", progress: 0, tasks: 0, done: 0, due: "TBD", assignee: "Andrew" },
  { id: 8, name: "ContractorWebDesign Launch", company: "zas", status: "stalled", progress: 30, tasks: 14, done: 4, due: "Apr 1", assignee: "Web Team" },
  { id: 9, name: "Andrew CRM Build", company: "zas", status: "active", progress: 35, tasks: 11, done: 4, due: "Mar 15", assignee: "Andrew + Agents" },
];

export const WEB_TASKS = [
  { id: 1, task: "Redesign homepage hero section", site: "adamsclinic.com", priority: "high", status: "in_progress", assignee: "Designer 1", due: "Mar 5" },
  { id: 2, task: "Add new service pages (3)", site: "highlandmasonry.org", priority: "high", status: "todo", assignee: "Unassigned", due: "Mar 8" },
  { id: 3, task: "Fix mobile nav breakpoint", site: "viscong.com", priority: "urgent", status: "todo", assignee: "Unassigned", due: "Mar 2" },
  { id: 4, task: "Write 4 blog posts — keyword targeted", site: "lplossconsulting.com", priority: "medium", status: "todo", assignee: "Agent", due: "Mar 15" },
  { id: 5, task: "Install analytics + Search Console", site: "contractorwebdesign.net", priority: "medium", status: "todo", assignee: "Unassigned", due: "Mar 10" },
  { id: 6, task: "Update footer across all Lucky's city sites", site: "Lucky's Network (30+)", priority: "low", status: "backlog", assignee: "Agent", due: "TBD" },
  { id: 7, task: "Speed optimization audit", site: "luckysconcreteservices.com", priority: "high", status: "in_progress", assignee: "Designer 1", due: "Mar 4" },
];

export const SITES = [
  { domain: "luckysconcreteservices.com", dr: 18, keywords: 24, traffic: 340, trend: "up", company: "luckys", status: "healthy" },
  { domain: "viscong.com", dr: 12, keywords: 172, traffic: 890, trend: "down", company: "zas", status: "attention" },
  { domain: "lplossconsulting.com", dr: 8, keywords: 80, traffic: 120, trend: "flat", company: "zas", status: "needs_work" },
  { domain: "adamsclinic.com", dr: 15, keywords: 43, traffic: 210, trend: "up", company: "zas", status: "healthy" },
  { domain: "yrtx.gop", dr: 25, keywords: 1, traffic: 0, trend: "flat", company: "yrtx", status: "needs_work" },
  { domain: "contractorwebdesign.net", dr: 5, keywords: 0, traffic: 0, trend: "flat", company: "zas", status: "new" },
  { domain: "highlandmasonry.org", dr: 10, keywords: 12, traffic: 45, trend: "up", company: "zas", status: "healthy" },
  { domain: "travisyr.com", dr: 8, keywords: 4, traffic: 15, trend: "flat", company: "yrtx", status: "healthy" },
  { domain: "luckysconcretedallas.com", dr: 4, keywords: 0, traffic: 0, trend: "flat", company: "luckys", status: "new" },
  { domain: "luckysconcretetampa.com", dr: 5, keywords: 0, traffic: 0, trend: "flat", company: "luckys", status: "new" },
];

export const YRTX_KEYWORDS = [
  { keyword: "young republicans of texas", volume: 720, position: 4, change: 2, difficulty: 18 },
  { keyword: "texas young republicans", volume: 480, position: 8, change: -1, difficulty: 22 },
  { keyword: "young conservatives of texas", volume: 320, position: 12, change: 3, difficulty: 15 },
  { keyword: "austin young republicans", volume: 210, position: null, change: 0, difficulty: 10 },
  { keyword: "young republicans club", volume: 590, position: null, change: 0, difficulty: 35 },
  { keyword: "conservative republicans of texas", volume: 260, position: null, change: 0, difficulty: 28 },
  { keyword: "young republican", volume: 1300, position: null, change: 0, difficulty: 42 },
  { keyword: "young conservatives", volume: 880, position: null, change: 0, difficulty: 38 },
  { keyword: "texas republican website", volume: 170, position: 18, change: 5, difficulty: 12 },
];

export const EMAILS = [
  { id: 1, from: "Jake (Lucky's)", subject: "Houston bid — $14,200 from Martinez", time: "22m", company: "luckys", unread: true, actionable: true },
  { id: 2, from: "PayPal", subject: "Payment received: $2,400 from Viscong", time: "1h", company: "zas", unread: true, actionable: false },
  { id: 3, from: "Google Ads", subject: "YRTX weekly report — 380 clicks", time: "2h", company: "yrtx", unread: true, actionable: true },
  { id: 4, from: "Thompson Excavating", subject: "Invoice #TE-4892 — $9,400 due", time: "3h", company: "luckys", unread: true, actionable: true },
  { id: 5, from: "WPMUDEV", subject: "3 plugin updates available", time: "5h", company: "zas", unread: false, actionable: false },
];

export const EVENTS = [
  { id: 1, title: "DFW Sub Meeting", time: "9:00 AM", end: "9:30 AM", company: "luckys" },
  { id: 2, title: "Review Adams Clinic mockups", time: "10:30 AM", end: "11:00 AM", company: "zas" },
  { id: 3, title: "YRTX Strategy + Ad Review", time: "1:00 PM", end: "1:45 PM", company: "yrtx" },
  { id: 4, title: "Tampa PM Weekly", time: "3:00 PM", end: "3:30 PM", company: "luckys" },
  { id: 5, title: "Web Team Standup", time: "4:00 PM", end: "4:15 PM", company: "zas" },
];

export const VOICE_MEMOS = [
  { id: 1, transcript: "Need to follow up with Houston sub on that driveway bid. Also remind me to check ZAS insurance renewal by Friday.", time: "Yesterday 4:30 PM", duration: "0:42", parsed: [
    { text: "Follow up with Houston sub on driveway bid", company: "luckys", priority: "high", status: "pending" },
    { text: "Check ZAS insurance renewal", company: "zas", priority: "medium", status: "pending", due: "Friday" },
  ]},
  { id: 2, transcript: "Schedule a call with the YRTX ad guy about targeting young republican keywords in DFW.", time: "Yesterday 11:15 AM", duration: "0:28", parsed: [
    { text: "Schedule call — YRTX ad targeting for DFW keywords", company: "yrtx", priority: "high", status: "approved" },
    { text: "Set up location-specific ad groups", company: "yrtx", priority: "medium", status: "pending" },
  ]},
];

export const AGENT_JOBS = [
  { id: 1, title: "Redesign Adams Clinic homepage hero", type: "design", target: "adamsclinic.com", company: "zas", status: "reviewing", agent_pass: 2, total_passes: 3, elapsed: 754, pr_url: "#", started: "11:42 AM" },
  { id: 2, title: "Write 4 blog posts for LP Loss Consulting", type: "content", target: "lplossconsulting.com", company: "zas", status: "building", agent_pass: 1, total_passes: 4, elapsed: 312, started: "12:01 PM" },
  { id: 3, title: "Add LocalBusiness schema to Lucky's Tampa", type: "seo", target: "luckysconcretetampa.com", company: "luckys", status: "building", agent_pass: 1, total_passes: 3, elapsed: 128, started: "12:15 PM" },
  { id: 4, title: "Fix mobile nav breakpoint", type: "code", target: "viscong.com", company: "zas", status: "queued", agent_pass: 0, total_passes: 3, elapsed: 0, started: null },
  { id: 5, title: "Update footer across Lucky's city sites", type: "batch", target: "30+ Lucky's sites", company: "luckys", status: "queued", agent_pass: 0, total_passes: 3, elapsed: 0, started: null },
  { id: 6, title: "Daily YRTX keyword rank check", type: "seo", target: "yrtx.gop", company: "yrtx", status: "complete", agent_pass: 1, total_passes: 1, elapsed: 45, result: "+2 positions on 'young republicans of texas'", started: "6:00 AM" },
  { id: 7, title: "Generate morning briefing report", type: "report", target: "Andrew CRM", company: "zas", status: "complete", agent_pass: 1, total_passes: 1, elapsed: 22, result: "Briefing delivered to Slack", started: "5:58 AM" },
  { id: 8, title: "Redesign Highland Masonry service area page", type: "design", target: "highlandmasonry.org", company: "zas", status: "complete", agent_pass: 3, total_passes: 3, elapsed: 890, result: "Deployed — PR #42 merged", pr_url: "#", started: "Yesterday 3:00 PM" },
  { id: 9, title: "Write 'Stamped Concrete' page for Austin site", type: "content", target: "luckysconcreteaustin.com", company: "luckys", status: "complete", agent_pass: 4, total_passes: 4, elapsed: 620, result: "Saved as WordPress draft", started: "Yesterday 1:30 PM" },
];
