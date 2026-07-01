# HN Platform — Architecture Bible v1.0 · خطة التنفيذ

هذه خطة بناء **HN Platform** كنظام تشغيل رقمي (Digital Operating System) لمنظومة HN، مبنية على الوثيقة المرجعية التي شاركتها. سنعتمدها كـ **Single Source of Truth** داخل المشروع نفسه، ونبني على مراحل — لا في جلسة واحدة — كما اقترحت.

---

## المبادئ الحاكمة (تُطبَّق في كل مرحلة)

- Single Source of Truth للتصميم والبيانات والمنطق.
- Reusable Components + Shared Services، لا تكرار.
- HN Design Language موحّد (Glass / Blur / Lighting / Motion / Dark+Light).
- كل تطبيق داخل HN Platform = وحدة مستقلة قابلة للتوسع.
- الأداء والأمان قرار في كل خطوة، لا مرحلة لاحقة.
- الوثيقة تعيش داخل المشروع ويقرأها الوكلاء قبل أي مهمة.

---

## المرحلة 0 — تثبيت الوثيقة داخل المشروع

- إنشاء `docs/architecture-bible/` بداخله:
  - `00-preamble.md` (المقدمة الرسمية + قواعد التنفيذ التي كتبتها)
  - `01-philosophy.md` … `15-future.md` (هيكل الفصول الخمسة عشر، تُملأ فصلاً بعد فصل)
  - `README.md` كفهرس ملاحي للوثيقة.
- إنشاء صفحة داخل المنصة `/foundation/bible` تعرض الوثيقة بواجهة قراءة أنيقة (Markdown → UI)، لتصبح جزءاً من HN Platform نفسها.
- تسجيل قواعد التنفيذ في ذاكرة المشروع (`mem://`) لتُطبَّق تلقائياً في كل جلسة.

## المرحلة 1 — HN Design Language (الأساس البصري)

- تعريف نظام تصميم كامل في `src/styles.css` باستخدام `oklch` وTokens دلالية:
  - ألوان: خلفيات داكنة عميقة + Accents بنفسجي/سماوي/أخضر نيون (مطابق للـ Mockup).
  - Gradients, Glass surfaces, Glow/Lighting, Shadows.
  - Typography: عائلة عرض + عائلة نص (بدون Inter/Poppins الافتراضية).
  - Motion tokens (durations, easings) لاستخدامها مع Framer Motion.
- مكتبة primitives موحّدة: `GlassCard`, `GlowIcon`, `StatTile`, `AppTile`, `StatusDot`, `SectionHeader`, `EnergyLine`.
- Dark Mode أولاً + Light Mode متكامل + Responsive.

## المرحلة 2 — HN Core Shell (القلب التشغيلي)

- تخطيط رئيسي: Sidebar + Topbar + Content + Right Rail (كما في الصورة).
- مكوّنات Shell قابلة لإعادة الاستخدام عبر كل التطبيقات الفرعية.
- Routing عبر TanStack Router بملفات مستقلة لكل قسم (لا Hash anchors).
- Command Palette (⌘K)، Notifications، Locale switcher، Theme switcher، Profile.

## المرحلة 3 — Dashboard (الصفحة المعروضة في الصورة)

- Welcome hero + إحصاءات (Total Apps / Active Projects / AI Agents / Databases / Uptime).
- شبكة HN Applications (AI, Builder, Video, DB, Cloud, Store, Audit, Nawat, Foundation, Support, Analytics, + Add New).
- System Status, AI Assistant panel, Recent Projects, System Activity, Statistics Overview.
- HN Core Status widget في الشريط الجانبي.
- كل البيانات تأتي من مصدر موحّد (Mock service الآن، Cloud لاحقاً).

## المرحلة 4 — هياكل التطبيقات الفرعية

إنشاء Routes وشِلْ فارغ لكل تطبيق مع نفس Design Language:
`/applications`, `/ai-center`, `/projects`, `/database`, `/cloud`, `/automation`, `/analytics`, `/security`, `/nawat`, `/foundation`, `/settings`.
كل صفحة = Placeholder احترافي جاهز للتعبئة في مراحل لاحقة، لا محتوى وهمي رخيص.

## المرحلة 5 — Data Architecture (تفعيل Lovable Cloud)

- تفعيل Cloud وتصميم Entities الأساسية من الفصل السادس: Users, Roles, Projects, Applications, Agents, Tasks, Events, Notifications, Logs, Documents, Knowledge, Secrets, Analytics.
- RLS + Roles table منفصلة (`user_roles` + `has_role`) — لا roles على profiles.
- Auth (تسجيل/دخول/خروج) مع صفحة `/auth`.

## المرحلة 6 — HN AI Layer

- ربط Lovable AI Gateway (Gemini افتراضياً) عبر `createServerFn`.
- AI Assistant الحقيقي في الـ Dashboard: Create Project / Analyze Data / Generate Report / System Health Check.
- قراءة Architecture Bible كسياق قبل أي مهمة (تُمرَّر كـ system context).

## المرحلة 7+ — Automation · Security · Governance · Knowledge · Evolution · Future

تُنفَّذ بنفس المنهج فصلاً بعد فصل، وفق ترتيب فصول الوثيقة.

---

## نطاق هذه الجلسة (Deliverable الآن)

للحفاظ على الجودة، سأنفذ في **هذه الدفعة** المراحل **0 → 3**:

1. تركيب `docs/architecture-bible/` مع المقدمة الرسمية + قواعد التنفيذ + هيكل الفصول الخمسة عشر (كل فصل بملف يحوي عنوانه ونقاطه الرئيسية من الوثيقة، جاهز للتعميق لاحقاً).
2. HN Design Language كامل في `styles.css` + primitives.
3. HN Core Shell (Sidebar + Topbar + Right Rail + Layout Route).
4. Dashboard كامل يطابق الصورة المرفقة بدقة (Hero, Stats, Applications grid, System Status, AI Assistant, Recent Projects, System Activity, Statistics Overview, Core Status, Footer).
5. Routes فارغة (Placeholders راقية) لبقية أقسام Sidebar لتفادي روابط مكسورة.
6. تحديث Metadata (title/description/og) لصفحة `HN Platform`.
7. حفظ قواعد التنفيذ في `mem://` لتلتزم بها كل الجلسات القادمة.

المراحل 4→7+ (Cloud, Auth, AI Gateway, باقي التطبيقات، فصول الوثيقة بتفصيلها الكامل) ننفذها في دفعات لاحقة — فصلاً بعد فصل — كما اقترحت تماماً.

---

## Technical Notes

- Stack: TanStack Start + React 19 + Tailwind v4 + Framer Motion + shadcn primitives (مُخصّصة بالكامل، بلا مظهر افتراضي).
- Routing: ملفات مستقلة في `src/routes/` (لا `src/pages/`، لا hash anchors للتنقل الرئيسي).
- Tokens دلالية فقط داخل المكوّنات (`bg-background`, `text-primary` …) — ممنوع hardcoded colors.
- الوثيقة تُخدَّم كـ Markdown وتُعرض داخل `/foundation/bible` بمكوّن قارئ موحّد.
- Metadata مخصّصة لكل Route (title/description/og/twitter).
- لا محتوى Placeholder من قالب Lovable — الصفحة الرئيسية تصبح Dashboard الحقيقي.

بعد موافقتك أبدأ التنفيذ مباشرة بالدفعة الأولى (المراحل 0→3)، ثم ننتقل لفصول الوثيقة والتطبيقات الفرعية واحداً تلو الآخر.
