# Chapter 06 — Data Architecture (معمار البيانات)

> كل كيان، حقوله، علاقاته، فهارسه، صلاحياته، ودورة حياته.

## المبادئ

UUID للمفاتيح، created_at/updated_at إلزامي، حذف منطقي (soft delete) عند اللزوم، RLS إجباري، GRANT صريح.

## الكيانات الأساسية

profiles · user_roles · projects · applications · events · ai_conversations · ai_messages · knowledge_nodes · audit_logs.

## العلاقات

project ↔ user (owner) · project ↔ application (uses) · knowledge_node ↔ project (context) · event ↔ actor.

## دورة الحياة

Draft → Active → Archived. لا حذف حقيقي إلا عبر Admin مع Audit Log.
