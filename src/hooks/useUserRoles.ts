import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/hn/db-types";

export function useUserRoles() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setUserId(s?.user?.id ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const query = useQuery({
    queryKey: ["user_roles", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });

  const roles = query.data ?? [];
  return {
    roles,
    isAdmin: roles.includes("admin"),
    isEditor: roles.includes("editor") || roles.includes("admin"),
    loading: query.isLoading,
  };
}
