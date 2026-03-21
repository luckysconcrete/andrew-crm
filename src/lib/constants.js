export const MODULES = [
  { id: "briefing", label: "Briefing", icon: "\u2600\uFE0F", group: "daily" },
  { id: "projects", label: "Projects", icon: "\uD83D\uDCCB", group: "work" },
  { id: "webteam", label: "Web Team", icon: "\uD83C\uDFA8", group: "work" },
  { id: "sites", label: "Sites", icon: "\uD83C\uDF10", group: "work" },
  { id: "yrtx", label: "YRTX", icon: "\uD83C\uDFDB\uFE0F", group: "campaigns" },
  { id: "email", label: "Email", icon: "\u2709\uFE0F", group: "comms" },
  { id: "calendar", label: "Calendar", icon: "\uD83D\uDCC5", group: "comms" },
  { id: "voice", label: "Voice", icon: "\uD83C\uDF99\uFE0F", group: "comms" },
  { id: "agents", label: "Agents", icon: "\uD83E\uDD16", group: "system" },
  { id: "luckys", label: "Lucky's", icon: "\uD83C\uDF40", group: "companies" },
];

export const GROUPS = {
  daily: "Daily",
  work: "Work",
  campaigns: "Campaigns",
  comms: "Communications",
  system: "System",
  companies: "Companies",
};

export const MOBILE_NAV_TABS = ["briefing", "projects", "agents", "email", "calendar"];

/** Map company key to display label */
export const companyLabel = (co) =>
  co === "luckys" ? "Lucky's" : co === "zas" ? "ZAS" : co === "yrtx" ? "YRTX" : co === "personal" ? "Personal" : "";

/** Map company key to theme color */
export const companyColor = (co, C) =>
  co === "luckys" ? C.luckys : co === "zas" ? C.zas : co === "yrtx" ? C.yrtx : co === "personal" ? C.purple : C.text3;

/** Job type metadata */
export const typeConfig = (C) => ({
  code: { c: C.blue, i: "\u26A1" },
  design: { c: C.purple, i: "\uD83C\uDFA8" },
  content: { c: C.green, i: "\u270D\uFE0F" },
  seo: { c: C.amber, i: "\uD83D\uDCCA" },
  report: { c: C.cyan, i: "\uD83D\uDCCB" },
  batch: { c: C.luckys, i: "\uD83D\uDD04" },
});

/** Job status metadata */
export const statusConfig = (C) => ({
  queued: { c: C.text3, l: "Queued" },
  building: { c: C.blue, l: "Building" },
  reviewing: { c: C.purple, l: "Reviewing" },
  testing: { c: C.amber, l: "Testing" },
  deploying: { c: C.green, l: "Deploying" },
  complete: { c: C.green, l: "Complete" },
  failed: { c: C.red, l: "Failed" },
});

/** Priority metadata */
export const priorityConfig = (C) => ({
  urgent: { c: C.red, l: "URGENT" },
  high: { c: C.amber, l: "HIGH" },
  medium: { c: C.blue, l: "MED" },
  low: { c: C.text3, l: "LOW" },
});

/** Format seconds to m:ss */
export const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
};
