export async function backlinksFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string> | undefined) };
  if (init?.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });
  const data = (await res.json().catch(() => ({}))) as T & { ok?: boolean; error?: string };
  if (!res.ok) throw new Error(typeof (data as { error?: string }).error === "string" ? (data as { error: string }).error : `HTTP ${res.status}`);
  return data as T;
}
