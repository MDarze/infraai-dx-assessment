const BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(/\/$/, "");

if (typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.info("[infraai] api base =", BASE || "(unset — VITE_API_URL was empty at build time)");
}

export const hasBackend = (): boolean => Boolean(BASE);
export const apiBase = (): string => BASE;

function mapSize(s: string): "<50" | "50-200" | "200+" {
  if (s === "lt50") return "<50";
  if (s === "50to200") return "50-200";
  return "200+";
}

export async function syncToBackend(state: {
  meta: { clientName: string; companySize: string; assessorName: string; contactEmail?: string; contactPhone?: string; commercialRegistration?: string; city?: string };
  respondents: Array<{ role: string; answers: Record<string, unknown> }>;
  roi: { engineersCount: number; workingDaysPerWeek: number; timeSavingRate: number; avgHourCostSar: number | null };
}): Promise<string> {
  const regRes = await fetch(`${BASE}/api/client/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: state.meta.clientName,
      companySize: mapSize(state.meta.companySize),
      city: state.meta.city || "N/A",
      contactName: state.meta.assessorName,
      contactEmail: state.meta.contactEmail || `field.${Date.now()}@infraai.local`,
      contactPhone: state.meta.contactPhone?.trim() || `0000${Date.now().toString().slice(-7)}`,
      emirateRegistration: state.meta.commercialRegistration?.trim() || `PENDING-${Date.now()}`,
      industry: "Construction",
    }),
  });
  if (!regRes.ok) {
    const e = await regRes.json().catch(() => ({})) as { error?: string };
    throw new Error(e.error ?? `Register failed: ${regRes.status}`);
  }
  const regData = await regRes.json() as { data: { assessmentId: string } };
  const assessmentId = regData.data.assessmentId;

  const respondents = state.respondents.map((r) => ({
    role: r.role,
    name: r.role,
    answers: Object.entries(r.answers).map(([questionId, value]) => ({ questionId, value })),
    completedAt: new Date().toISOString(),
  }));

  const roiSettings = {
    engineersCount: state.roi.engineersCount ?? 3,
    workingDaysPerWeek: state.roi.workingDaysPerWeek ?? 5,
    savingRate: state.roi.timeSavingRate ?? 0.25,
    hourlyCost: state.roi.avgHourCostSar ?? 75,
    overheadMultiplier: 1.3,
    currency: "SAR" as const,
  };

  const subRes = await fetch(`${BASE}/api/client/assessment/${assessmentId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ respondents, roiSettings }),
  });
  if (!subRes.ok) {
    const e = await subRes.json().catch(() => ({})) as { error?: string };
    throw new Error(e.error ?? `Submit failed: ${subRes.status}`);
  }

  return assessmentId;
}
