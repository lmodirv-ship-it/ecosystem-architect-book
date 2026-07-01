import {
  Globe,
  AppWindow,
  Smartphone,
  Bot,
  Clapperboard,
  Cloud,
  Database,
  Palette,
  LineChart,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/components/hn/primitives";

export type HNBuilder = {
  slug: string;
  emoji: string;
  name: string;
  arabic: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
  keywords: string[];
  items: string[];
};

export const HN_BUILDERS: HNBuilder[] = [
  {
    slug: "website",
    emoji: "🌍",
    name: "Website Builder",
    arabic: "منشئ المواقع",
    tagline: "Sites, stores, blogs, portfolios",
    description: "بناء أي نوع من المواقع الحديثة اعتماداً على HN Design Language.",
    icon: Globe,
    tone: "violet",
    keywords: ["site", "website", "موقع", "متجر", "store", "blog", "landing", "portfolio", "saas"],
    items: [
      "Corporate sites",
      "E-commerce stores",
      "Blogs & magazines",
      "Personal portfolios",
      "SaaS websites",
      "Landing pages",
      "Enterprise portals",
    ],
  },
  {
    slug: "application",
    emoji: "💻",
    name: "Application Builder",
    arabic: "منشئ التطبيقات",
    tagline: "Web apps, CRM, ERP, dashboards",
    description: "توليد تطبيقات ويب كاملة مع منطق أعمال وقواعد بيانات وواجهات إدارة.",
    icon: AppWindow,
    tone: "sky",
    keywords: ["app", "application", "تطبيق", "crm", "erp", "pos", "hr", "dashboard", "admin"],
    items: ["Web Apps", "CRM", "ERP", "POS", "HR", "Dashboards", "Admin Panels"],
  },
  {
    slug: "mobile",
    emoji: "📱",
    name: "Mobile Builder",
    arabic: "منشئ تطبيقات الجوّال",
    tagline: "Android · iOS · PWA",
    description: "توليد تطبيقات جوّال أصلية أو PWA من نفس مشروع Platform.",
    icon: Smartphone,
    tone: "cyan",
    keywords: ["mobile", "android", "ios", "pwa", "apk", "ipa", "جوال", "أندرويد", "آيفون"],
    items: ["Android", "iOS", "PWA", "APK export", "IPA export"],
  },
  {
    slug: "ai",
    emoji: "🤖",
    name: "AI Builder",
    arabic: "منشئ الذكاء الاصطناعي",
    tagline: "Agents · Chat · Voice · Vision",
    description: "تصميم وكلاء ذكاء اصطناعي متخصّصين وتشغيلهم داخل أي مشروع.",
    icon: Bot,
    tone: "mint",
    keywords: ["ai", "agent", "chatbot", "voice", "vision", "بوت", "وكيل", "ذكاء"],
    items: ["AI Agents", "Chatbots", "Voice AI", "Image AI", "Video AI", "Document AI"],
  },
  {
    slug: "media",
    emoji: "🎬",
    name: "Media Builder",
    arabic: "منشئ الميديا",
    tagline: "Video · Audio · Images",
    description: "توليد وتحرير الفيديو والصوت والصور بواسطة الذكاء الاصطناعي.",
    icon: Clapperboard,
    tone: "rose",
    keywords: ["video", "audio", "image", "voice clone", "فيديو", "صوت", "صورة", "مونتاج"],
    items: [
      "Video generation",
      "Editing / montage",
      "Site → Video",
      "Article → Video",
      "Image generation",
      "Voice generation",
      "Voice cloning",
    ],
  },
  {
    slug: "cloud",
    emoji: "☁",
    name: "Cloud Builder",
    arabic: "منشئ السحابة",
    tagline: "Deploy · Domain · DNS · SSL",
    description: "نشر أي مشروع وشراء الدومين وإدارة DNS و SSL و CDN والنسخ الاحتياطي.",
    icon: Cloud,
    tone: "amber",
    keywords: ["deploy", "domain", "dns", "ssl", "cdn", "backup", "نشر", "دومين", "سحابة"],
    items: ["Deployment", "Domain purchase", "DNS", "SSL", "CDN", "Backups"],
  },
  {
    slug: "database",
    emoji: "🗄",
    name: "Database Builder",
    arabic: "منشئ قواعد البيانات",
    tagline: "Tables · Relations · APIs",
    description: "إنشاء قواعد بيانات مع جداول وعلاقات و APIs تلقائيّة.",
    icon: Database,
    tone: "sky",
    keywords: ["database", "db", "table", "api", "قاعدة بيانات", "جدول", "علاقات"],
    items: ["Create databases", "Tables designer", "APIs auto-gen", "Relations", "Import", "Export"],
  },
  {
    slug: "design",
    emoji: "🎨",
    name: "Design Studio",
    arabic: "استوديو التصميم",
    tagline: "UI · Themes · Logos · Icons",
    description: "بناء واجهات وثيمات وأنيميشن وأيقونات وشعارات متّسقة مع HN Design Language.",
    icon: Palette,
    tone: "violet",
    keywords: ["design", "ui", "theme", "logo", "icon", "animation", "تصميم", "شعار", "أيقونة"],
    items: ["UI Builder", "Theme Builder", "Animation Builder", "Icon Builder", "Logo Builder"],
  },
  {
    slug: "business",
    emoji: "📊",
    name: "Business Center",
    arabic: "مركز الأعمال",
    tagline: "Analytics · SEO · Marketing",
    description: "متابعة الأداء و SEO والحملات التسويقيّة والإشعارات لكل مشروع.",
    icon: LineChart,
    tone: "cyan",
    keywords: ["analytics", "seo", "marketing", "email", "notification", "تسويق", "تحليلات"],
    items: ["Analytics", "SEO", "Marketing", "Emails", "Notifications"],
  },
  {
    slug: "project-manager",
    emoji: "🧠",
    name: "AI Project Manager",
    arabic: "مدير المشاريع الذكي",
    tagline: "Plans · Codes · Ships · Reviews",
    description:
      "العقل الحقيقي للمنصة: يخطّط المشروع، يكتب الكود، يبني قواعد البيانات، يختبر، ينشر، ويكتب التوثيق.",
    icon: BrainCircuit,
    tone: "violet",
    keywords: ["manager", "plan", "orchestrate", "review", "audit", "مدير", "تخطيط"],
    items: [
      "Plan the project",
      "Write code",
      "Fix errors",
      "Build databases",
      "Test the project",
      "Deploy to servers",
      "Generate intro video",
      "Write documentation",
      "Generate logos",
      "Review performance",
      "Suggest improvements",
    ],
  },
];

export const HN_BUILDER_BY_SLUG: Record<string, HNBuilder> = Object.fromEntries(
  HN_BUILDERS.map((b) => [b.slug, b]),
);

/** Very light heuristic router — a placeholder for the real HN Core dispatcher. */
export function hnCoreRoute(prompt: string): HNBuilder[] {
  const p = prompt.toLowerCase();
  const hits = HN_BUILDERS.filter((b) => b.keywords.some((k) => p.includes(k.toLowerCase())));
  if (hits.length === 0) return [HN_BUILDER_BY_SLUG["project-manager"]];
  // Always include the PM as orchestrator
  const pm = HN_BUILDER_BY_SLUG["project-manager"];
  return hits.includes(pm) ? hits : [pm, ...hits];
}
