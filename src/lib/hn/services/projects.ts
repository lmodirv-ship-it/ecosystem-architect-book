import { supabase } from "@/integrations/supabase/client";
import type { ProjectKind, ProjectRow, ProjectStatus } from "@/lib/hn/db-types";
import { logActivity } from "@/lib/hn/services/sites";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `project-${Date.now()}`;
}

export async function listProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ProjectRow[];
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as ProjectRow | null;
}

export async function createProject(input: {
  name: string;
  kind: ProjectKind;
  description?: string;
  builder?: string;
  linked_site_id?: string | null;
}): Promise<ProjectRow> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");
  const slug = slugify(input.name);
  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: userData.user.id,
      name: input.name,
      slug,
      kind: input.kind,
      description: input.description ?? null,
      builder: input.builder ?? input.kind,
      linked_site_id: input.linked_site_id ?? null,
      status: "draft" as ProjectStatus,
    })
    .select()
    .single();
  if (error) throw error;
  const row = data as unknown as ProjectRow;
  await logActivity("project.create", "project", row.id, { name: row.name, kind: row.kind });
  return row;
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<ProjectRow> {
  const { data, error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logActivity(`project.status.${status}`, "project", id);
  return data as unknown as ProjectRow;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  await logActivity("project.delete", "project", id);
}
