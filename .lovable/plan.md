# خطة التطوير الجادّة — HN Platform

## الوضع الحالي (تشخيص سريع)
- **16 جدول** جاهز في Lovable Cloud مع RLS، لكن **كلها فارغة** (0 صفوف في كل جدول).
- الواجهة كاملة (Dashboard, Sidebar, Sphere, Builders, Bible) لكن معظم الصفحات ما زالت Placeholders.
- المصادقة تعمل، ولا يوجد مستخدم واحد مسجّل حتى الآن.
- 141 موقع في `ecosystem.ts` غير مُستورد فعلياً إلى `sites`.
- لا يوجد AI Gateway مربوط، ولا Automation، ولا Storage، ولا Edge Functions للـ health checks الحقيقية.

## الفجوة الجوهرية
المنصّة اليوم = **قشرة جميلة فوق قاعدة بيانات فارغة**. التطوير الجادّ = تحويلها إلى **نظام تشغيلي فعلي** يُدار من داخله.

---

## المراحل (6 مراحل، كل مرحلة قابلة للتسليم مستقلّة)

### المرحلة 1 — التأسيس التشغيلي (Foundations)
- استيراد الـ141 موقع من `ecosystem.ts` إلى جدول `sites` تلقائياً عند أول دخول Admin.
- **Edge Function** حقيقية لفحص الحالة (بدلاً من `no-cors` في المتصفح): تُشغَّل عبر `pg_cron` كل 5 دقائق، تكتب في `health_checks` وتحدّث `sites.status/latency/ssl_expires_at`.
- صفحة `/applications` تعرض الحالة الحية + SSL + Uptime % آخر 24 ساعة.
- Seed بيانات تجريبية واقعية (Demo Mode) للـDashboard حتى يرى المالك المنصّة تعمل قبل ربط مصادره.

### المرحلة 2 — HN Cloud + Storage + Deployments
- تفعيل Storage buckets: `avatars`, `project-assets`, `site-backups`.
- جدول `deployments` + صفحة `/cloud` تعرض النشر الفعلي (سجل، حالة، rollback).
- ربط رفع صور الملف الشخصي والمشاريع بـStorage.

### المرحلة 3 — HN AI Center (المساعد الحقيقي)
- ربط **Lovable AI Gateway** (Gemini افتراضياً) عبر `createServerFn`.
- المساعد يقرأ Architecture Bible + بيانات المستخدم الحيّة كسياق.
- 4 أوامر جاهزة: Create Project · Analyze Revenue · Generate Report · Health Check.
- سجل محادثات في جدول `ai_conversations` + `ai_messages` (يُضاف في migration).
- Streaming responses + Rate limiting.

### المرحلة 4 — Builders الحقيقية
- **Website Builder**: قوالب جاهزة → ينشئ مشروع + Site مربوط + Deployment أوّلي.
- **Database Builder**: واجهة لإنشاء جداول داخل مشروع المستخدم (schema-per-project أو RLS-tenant).
- **Application Builder**: Scaffolding لتطبيق داخلي (form + table + API) يظهر في `/applications`.
- كل Builder يكتب Activity Log ويظهر في `Recent Projects`.

### المرحلة 5 — Automation + Governance
- جدول `automations` (trigger + action + schedule) + محرّك تنفيذ عبر Edge Function + pg_cron.
- Automations جاهزة: تنبيه SSL قبل انتهاء 14 يوم، تنبيه Site down > 5 دقائق، تنبيه Payment failed، تقرير أسبوعي بالإيميل.
- **Notifications** حقيقية (in-app + Email عبر Resend).
- **Audit Log** موحّد لكل عمليات Admin.
- User Management: دعوة أعضاء، تعيين أدوار (admin/editor/viewer)، صفحة `/settings/team`.

### المرحلة 6 — الجودة والإطلاق
- **Security Scan** + معالجة كل التنبيهات (RLS, exposed columns, leaked passwords HIBP).
- **SEO + Metadata** لكل صفحة عامة (og:image ديناميكي، sitemap، robots).
- **Performance**: Lighthouse ≥ 90، صور مضغوطة، lazy loading، Suspense boundaries.
- **Tests**: E2E عبر Playwright للمسارات الحرجة (auth, dashboard, import, create project).
- **Docs**: تحديث Bible بما تم بناؤه فعلياً + دليل المستخدم النهائي.
- **Publish** + Custom Domain.

---

## قواعد تنفيذ ملزِمة (تُطبَّق في كل مرحلة)
1. **لا Placeholder بعد اليوم** — أي صفحة تُلمس يجب أن تصبح وظيفية بالكامل قبل الانتقال.
2. **لا بيانات ثابتة في TypeScript** لأي شيء قابل للتغيير — كل شيء في Cloud.
3. كل Feature = Migration + Service + UI + Activity Log + اختبار يدوي موثّق.
4. HN Design Language فقط (tokens دلالية، لا ألوان مباشرة).
5. RLS + GRANT على كل جدول جديد، بلا استثناء.
6. كل تغيير Backend يمرّ عبر `createServerFn` (ليس Edge Function) إلا للـ webhooks والـ cron.

---

## اقتراح الدفعة القادمة (لو وافقت)
أنفّذ **المرحلة 1 كاملة** في دفعة واحدة:
- استيراد الـ141 موقع + Edge Function للـhealth + pg_cron.
- Demo seed للـDashboard.
- `/applications` تعمل بالكامل بالبيانات الحيّة.

هل أبدأ بالمرحلة 1، أم تفضّل ترتيباً مختلفاً (مثلاً AI Center أولاً)؟
