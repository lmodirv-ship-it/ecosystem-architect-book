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

export type BibleChapter = {
  n: string;
  slug: string;
  title: string;
  arabicTitle: string;
  summary: string;
  sections: { heading: string; body: string }[];
};

export const HN_BIBLE_CHAPTERS: BibleChapter[] = [
  {
    n: "01",
    slug: "philosophy",
    title: "Philosophy",
    arabicTitle: "الفلسفة",
    summary:
      "لماذا وُجدت HN Platform، ما المشكلة التي تحلّها، وعلاقتها بـ Foundation و AI و Nawat.",
    sections: [
      {
        heading: "المشكلة",
        body: "معظم المنصات تُبنى كموقع واحد ثم تُرقّع بمرور الوقت. النتيجة: تكرار في الكود، تشتّت في البيانات، وهوية بصرية تتآكل. HN Platform تُعالج ذلك من الجذر عبر بنية موحّدة قابلة للنمو.",
      },
      {
        heading: "الرؤية",
        body: "HN Platform ليست موقعاً — إنها نظام تشغيل رقمي (Digital OS) لمنظومة HN. يعمل كطبقة موحّدة تحمل التطبيقات، الوكلاء، البيانات، والقرارات.",
      },
      {
        heading: "العلاقات",
        body: "Foundation تضع القواعد. Platform تنفّذها. AI يفكّر ويقترح. Nawat يحفظ المعرفة. كل طبقة لها دور واضح، ولا تتداخل الأدوار.",
      },
      {
        heading: "المبدأ الأول",
        body: "كل قرار يُتّخذ اليوم يجب أن يكون صالحاً لعشرات التطبيقات غداً. لا نبني للحظة، بل للحقبة.",
      },
    ],
  },
  {
    n: "02",
    slug: "digital-ecosystem",
    title: "Digital Ecosystem",
    arabicTitle: "المنظومة الرقمية",
    summary: "الخريطة الكاملة: Foundation → Nawat → AI → Platform → Applications.",
    sections: [
      {
        heading: "الطبقات",
        body: "Foundation (الدستور) → Nawat (الذاكرة) → HN AI (العقل) → HN Platform (الجسد) → Applications (الأطراف). كل طبقة تعتمد على ما تحتها فقط.",
      },
      {
        heading: "التطبيقات",
        body: "HN AI · HN Builder · HN Nawat · HN Academy · HN Studio · HN Cloud · HN Analytics · HN Security. كلها مواطنون من الدرجة الأولى داخل Platform.",
      },
      {
        heading: "قاعدة عدم الالتفاف",
        body: "لا يُسمح لأي تطبيق بالوصول المباشر لبيانات تطبيق آخر — الوصول يتم عبر Platform Services فقط.",
      },
    ],
  },
  {
    n: "03",
    slug: "digital-architecture",
    title: "Digital Architecture",
    arabicTitle: "المعمار الرقمي",
    summary: "الطبقات التقنية: Frontend, Backend, DB, AI, Security, Cloud, Search, Memory, Automation, Monitoring.",
    sections: [
      {
        heading: "Frontend",
        body: "TanStack Start + React 19 + Tailwind v4. مكوّنات موحّدة عبر HN Design Language. لا CSS مخصّص خارج التوكنز الدلالية.",
      },
      {
        heading: "Backend",
        body: "Server Functions (createServerFn) للعمليات الداخلية، وServer Routes للـWebhooks. لا Edge Functions إلا للحالات المبرَّرة.",
      },
      {
        heading: "Database",
        body: "PostgreSQL عبر Lovable Cloud. مخطّط موحّد، مفاتيح UUID، RLS على كل جدول، وصلاحيات صريحة GRANT.",
      },
      {
        heading: "AI Layer",
        body: "Lovable AI Gateway. توجيه ذكي بين النماذج، ذاكرة طويلة عبر Nawat، حدود أمان (Guardrails).",
      },
      {
        heading: "Observability",
        body: "Logs, Metrics, Traces — قابلة للاستعلام من داخل Platform. أي خطأ في أي طبقة يظهر في Command Center.",
      },
    ],
  },
  {
    n: "04",
    slug: "core-engine",
    title: "Core Engine (HN Core)",
    arabicTitle: "المحرّك الأساسي",
    summary: "الهوية، المستخدمون، الصلاحيات، الأحداث، والتنسيق بين التطبيقات.",
    sections: [
      {
        heading: "Identity",
        body: "حساب واحد لكل شخص عبر كل التطبيقات. Single Sign-On داخلي.",
      },
      {
        heading: "Roles",
        body: "الأدوار في جدول user_roles منفصل، وتُقرأ عبر دالّة has_role مع SECURITY DEFINER. أبداً لا تُخزَّن على profiles.",
      },
      {
        heading: "Event Bus",
        body: "كل حدث مهم يُنشر (project.created, ai.suggestion.accepted, security.alert). الاستماع اختياري.",
      },
      {
        heading: "Orchestration",
        body: "HN Core ينسّق بين التطبيقات دون أن يعرف تفاصيلها. عقود واضحة، تنفيذ مستقل.",
      },
    ],
  },
  {
    n: "05",
    slug: "applications",
    title: "Applications",
    arabicTitle: "التطبيقات",
    summary: "دور كل تطبيق، البيانات التي يستهلكها وينتجها، وعلاقاته بالبقيّة.",
    sections: [
      {
        heading: "HN AI",
        body: "طبقة التفكير. تستهلك السياق من Nawat، تُنتج اقتراحات وتحليلات وقرارات.",
      },
      {
        heading: "HN Builder",
        body: "أداة توليد التطبيقات داخل Platform. تلتزم بـ Design Language و Bible.",
      },
      {
        heading: "HN Nawat",
        body: "الذاكرة طويلة الأمد. مصدر الحقيقة للمعرفة والقرارات.",
      },
      {
        heading: "HN Cloud / Analytics / Security",
        body: "خدمات أفقيّة تُقدَّم لكل التطبيقات بواجهة موحّدة.",
      },
    ],
  },
  {
    n: "06",
    slug: "data-architecture",
    title: "Data Architecture",
    arabicTitle: "معمار البيانات",
    summary: "كل كيان، حقوله، علاقاته، فهارسه، صلاحياته، ودورة حياته.",
    sections: [
      {
        heading: "المبادئ",
        body: "UUID للمفاتيح، created_at/updated_at إلزامي، حذف منطقي (soft delete) عند اللزوم، RLS إجباري، GRANT صريح.",
      },
      {
        heading: "الكيانات الأساسية",
        body: "profiles · user_roles · projects · applications · events · ai_conversations · ai_messages · knowledge_nodes · audit_logs.",
      },
      {
        heading: "العلاقات",
        body: "project ↔ user (owner) · project ↔ application (uses) · knowledge_node ↔ project (context) · event ↔ actor.",
      },
      {
        heading: "دورة الحياة",
        body: "Draft → Active → Archived. لا حذف حقيقي إلا عبر Admin مع Audit Log.",
      },
    ],
  },
  {
    n: "07",
    slug: "user-experience",
    title: "User Experience",
    arabicTitle: "تجربة المستخدم",
    summary: "التنقّل، البحث، فتح مشروع، الحركة، الرسائل، الإحساس.",
    sections: [
      {
        heading: "التنقّل",
        body: "قائمة جانبية ثابتة + شريط علوي + Command Palette (⌘K) في كل مكان.",
      },
      {
        heading: "الحركة",
        body: "Framer Motion. حركات هادئة (200–400ms)، Easing طبيعي، احترام prefers-reduced-motion.",
      },
      {
        heading: "الحالة الفارغة",
        body: "لا شاشة فارغة. كل صفحة تُخبر ماذا تفعل ولماذا وكيف تبدأ.",
      },
      {
        heading: "الرسائل",
        body: "لهجة واثقة موجزة. لا اعتذارات. لا مصطلحات تقنية للمستخدم النهائي.",
      },
    ],
  },
  {
    n: "08",
    slug: "design-language",
    title: "Design Language",
    arabicTitle: "لغة التصميم",
    summary: "زجاج، ضباب، إضاءة، جسيمات، حركة، خطوط، بطاقات، انتقالات، وصول، داكن وفاتح.",
    sections: [
      {
        heading: "الأساس",
        body: "خلفية كونية عميقة، أسطح زجاجيّة (glass) مع Backdrop Blur، حواف رفيعة مُضيئة.",
      },
      {
        heading: "الألوان",
        body: "Violet · Cyan · Mint · Amber · Rose · Sky. تُستخدم كإشارات دلاليّة لا كزينة.",
      },
      {
        heading: "الخطوط",
        body: "Space Grotesk للعناوين، Inter للنصوص. أبداً لا Inter/Poppins افتراضيّة معاً.",
      },
      {
        heading: "الوصول",
        body: "تباين AA على الأقل، تركيز واضح على العناصر، دعم لوحة المفاتيح كامل.",
      },
    ],
  },
  {
    n: "09",
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    arabicTitle: "الذكاء الاصطناعي",
    summary: "كيف يفكّر HN AI، يساعد، يقترح، يراجع، يبني، يكتب، يتذكّر، ويتعلّم.",
    sections: [
      {
        heading: "العقل",
        body: "طبقة توجيه (Router) تختار النموذج المناسب لكل مهمّة عبر Lovable AI Gateway.",
      },
      {
        heading: "الذاكرة",
        body: "قصيرة (المحادثة الحالية) + طويلة (Nawat). البحث الدلالي عبر Embeddings.",
      },
      {
        heading: "الوكلاء",
        body: "Architect · Designer · Reviewer · Writer · Analyst · Guardian. كل وكيل بمهمّة واضحة.",
      },
      {
        heading: "الحدود",
        body: "Guardrails على الإدخال والإخراج، وسجل تقييم دائم لكل قرار.",
      },
    ],
  },
  {
    n: "10",
    slug: "automation",
    title: "Automation",
    arabicTitle: "الأتمتة",
    summary: "النشر، النسخ الاحتياطي، المراقبة، الاختبار، الفحص الأمني، الإشعارات، الجدولة.",
    sections: [
      {
        heading: "CI/CD",
        body: "نشر تلقائي مع فحوصات جودة، وأمن، وتكامل قبل كل إصدار.",
      },
      {
        heading: "Schedulers",
        body: "pg_cron داخل Cloud للمهام الدورية. كل مهمّة موثّقة ومصادر خطئها معروفة.",
      },
      {
        heading: "AI Tasks",
        body: "مهام خلفيّة يشغّلها HN AI (تلخيص، تصنيف، مراجعة) بجدول أسبقية.",
      },
    ],
  },
  {
    n: "11",
    slug: "security",
    title: "Security",
    arabicTitle: "الأمن",
    summary: "الهويّة، المصادقة، التفويض، التشفير، التدقيق، الأسرار، الطوارئ.",
    sections: [
      {
        heading: "Auth",
        body: "Lovable Cloud Auth. جلسات آمنة، تدوير رموز، حماية من CSRF/XSS.",
      },
      {
        heading: "AuthZ",
        body: "RLS على كل جدول، وأدوار عبر has_role. لا فحص أدوار من الواجهة فقط.",
      },
      {
        heading: "Secrets",
        body: "أسرار في مدير الأسرار فقط. أبداً لا في الكود أو الـ repo.",
      },
      {
        heading: "Audit",
        body: "audit_logs غير قابل للتعديل. كل عملية حساسة تُسجَّل.",
      },
    ],
  },
  {
    n: "12",
    slug: "governance",
    title: "Governance",
    arabicTitle: "الحوكمة",
    summary: "كيف تُعتمد القرارات، الميزات، التصاميم، التحديثات، والكود.",
    sections: [
      {
        heading: "قرارات معماريّة",
        body: "كل قرار مهم يوثَّق كـ ADR (Architecture Decision Record) داخل Nawat.",
      },
      {
        heading: "مراجعة الكود",
        body: "لا دمج بدون مراجعة. HN AI Reviewer يفحص أولاً، ثم مراجع بشري.",
      },
      {
        heading: "الميزات",
        body: "كل ميزة تمرّ بـ: اقتراح → موافقة → تصميم → تنفيذ → قياس.",
      },
    ],
  },
  {
    n: "13",
    slug: "knowledge",
    title: "Knowledge",
    arabicTitle: "المعرفة",
    summary: "كيف تُخزَّن المعرفة، تُربط، تُبحث، وكيف ترتبط بـ HN Nawat.",
    sections: [
      {
        heading: "المخزن",
        body: "knowledge_nodes بروابط متعدّدة (WikiLinks). كل عقدة نوعها، مصدرها، وسياقها.",
      },
      {
        heading: "البحث",
        body: "بحث نصّي + بحث دلالي (embeddings). النتائج تُظهر السياق لا الأسطر فقط.",
      },
      {
        heading: "الربط مع Nawat",
        body: "Nawat مصدر الحقيقة. Platform يقرأ ويكتب عبر واجهة موحّدة.",
      },
    ],
  },
  {
    n: "14",
    slug: "evolution",
    title: "Evolution",
    arabicTitle: "التطوّر",
    summary: "كيف تضيف تطبيقاً أو وكيلاً أو خدمة جديدة دون كسر أيّ شيء.",
    sections: [
      {
        heading: "إضافة تطبيق",
        body: "1) تعريفه في applications registry. 2) إعطاؤه أيقونة ولون. 3) توصيله بالـ Event Bus. 4) توثيقه في Bible.",
      },
      {
        heading: "إضافة وكيل AI",
        body: "1) تعريف مهمّته. 2) اختيار النموذج. 3) كتابة Prompt في Prompt Library. 4) إضافة تقييم.",
      },
      {
        heading: "إضافة جدول",
        body: "Migration + GRANT + RLS + Policies + توثيق في Chapter 06.",
      },
    ],
  },
  {
    n: "15",
    slug: "future",
    title: "Future",
    arabicTitle: "المستقبل",
    summary: "خارطة الطريق، الإصدارات، الأهداف، والمراحل.",
    sections: [
      {
        heading: "v1.0",
        body: "Foundation + Design Language + Shell + Dashboard + Applications Registry.",
      },
      {
        heading: "v1.1",
        body: "Auth + Data Layer + Nawat MVP + AI Center.",
      },
      {
        heading: "v1.2",
        body: "Builder MVP + Automation Engine + Analytics.",
      },
      {
        heading: "v2.0",
        body: "منظومة كاملة قابلة للفتح لمطوّرين خارجيّين ببنية إضافات موحّدة.",
      },
    ],
  },
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

export function getChapterBySlug(slug: string) {
  return HN_BIBLE_CHAPTERS.find((c) => c.slug === slug);
}
