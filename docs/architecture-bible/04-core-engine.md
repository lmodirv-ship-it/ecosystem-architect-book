# Chapter 04 — Core Engine (HN Core) (المحرّك الأساسي)

> الهوية، المستخدمون، الصلاحيات، الأحداث، والتنسيق بين التطبيقات.

## Identity

حساب واحد لكل شخص عبر كل التطبيقات. Single Sign-On داخلي.

## Roles

الأدوار في جدول user_roles منفصل، وتُقرأ عبر دالّة has_role مع SECURITY DEFINER. أبداً لا تُخزَّن على profiles.

## Event Bus

كل حدث مهم يُنشر (project.created, ai.suggestion.accepted, security.alert). الاستماع اختياري.

## Orchestration

HN Core ينسّق بين التطبيقات دون أن يعرف تفاصيلها. عقود واضحة، تنفيذ مستقل.
