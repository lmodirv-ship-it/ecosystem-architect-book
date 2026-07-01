/**
 * HN Platform Architecture Bible v1.0 — in-app SSOT
 * Mirrors /docs/architecture-bible/. Any edits must keep both in sync.
 */

export const HN_BIBLE_PREAMBLE = `HN Platform Architecture Bible v1.0

هذا المستند هو المرجع الرسمي لبناء HN Platform.
قبل كتابة أي سطر برمجي أو إنشاء أي صفحة أو أي قاعدة بيانات أو أي واجهة مستخدم، يجب قراءة هذا المستند بالكامل.
كل ما يرد في هذا المستند يمثل القرارات المعمارية الرسمية للمشروع.
لا تقم بإعادة تفسيرها أو تبسيطها أو حذفها.
إذا احتجت إلى اقتراح تحسين، فاقترحه دون مخالفة هذه الوثيقة.
الهدف هو بناء منصة يمكنها أن تنمو لعشرات التطبيقات والخدمات دون الحاجة إلى إعادة هيكلة المشروع مستقبلاً.`;

export const HN_BIBLE_CHAPTERS: {
  n: string;
  title: string;
  summary: string;
}[] = [
  { n: "01", title: "Philosophy", summary: "Why HN Platform exists, the problem it solves, its relationship with Foundation, AI and Nawat." },
  { n: "02", title: "Digital Ecosystem", summary: "The full map: Foundation → Nawat → AI → Platform → Applications, and the function of every relationship." },
  { n: "03", title: "Digital Architecture", summary: "Frontend, Backend, Database, AI, Security, Cloud, Search, Memory, Automation, Monitoring layers." },
  { n: "04", title: "Core Engine (HN Core)", summary: "The real heart of the platform — identity, users, permissions, events and orchestration." },
  { n: "05", title: "Applications", summary: "Each app's function, data it consumes/produces, and its relationships with the rest." },
  { n: "06", title: "Data Architecture", summary: "Every entity, its fields, relations, indexes, permissions and lifecycle." },
  { n: "07", title: "User Experience", summary: "Navigation, search, opening a project, motion, messaging, feel." },
  { n: "08", title: "Design Language", summary: "Glass, blur, lighting, particles, motion, typography, cards, transitions, accessibility, dark & light." },
  { n: "09", title: "Artificial Intelligence", summary: "How HN AI thinks, helps, suggests, reviews, builds, writes, remembers and learns." },
  { n: "10", title: "Automation", summary: "Deployment, backup, monitoring, testing, security scans, notifications, schedulers, AI tasks." },
  { n: "11", title: "Security", summary: "Identity, auth, authorization, encryption, audit, secrets, disaster & incident response." },
  { n: "12", title: "Governance", summary: "How decisions, features, designs, updates and code are approved." },
  { n: "13", title: "Knowledge", summary: "How knowledge is stored, linked, searched, and how it connects to HN Nawat." },
  { n: "14", title: "Evolution", summary: "How to add a new app, agent, AI, database or service without breaking anything." },
  { n: "15", title: "Future", summary: "Roadmap, releases, goals, phases." },
];

export const HN_BIBLE_RULES = [
  "لا تكرر الكود إذا أمكن إنشاء Component قابل لإعادة الاستخدام.",
  "لا تكرر المنطق البرمجي إذا أمكن إنشاء Service مشتركة.",
  "لا تكرر البيانات إذا أمكن إنشاء مصدر واحد للحقيقة (Single Source of Truth).",
  "اجعل كل وحدة مستقلة وقابلة للتطوير.",
  "أي ميزة جديدة يجب أن تكون قابلة للتوسع.",
  "لا تكسر التصميم الموحد.",
  "لا تكسر HN Design Language.",
  "لا تكسر قواعد HN Foundation.",
  "وثّق كل قرار هندسي مهم.",
  "حدّث الوثائق إذا تغيرت البنية.",
  "اجعل الأداء والأمان جزءًا من كل قرار، وليس مرحلة لاحقة.",
  "إذا وجدت طريقة أفضل، اقترحها مع توضيح أثرها، لكن لا تنفذها إلا بعد الموافقة.",
];
