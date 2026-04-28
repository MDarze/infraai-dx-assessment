export type Sector = "INFRA" | "HEALTH" | "REAL" | "GOV";

export const SECTORS: Sector[] = ["INFRA", "HEALTH", "REAL", "GOV"];

export type Dimension =
  | "operations"
  | "project_workflow"
  | "site_management"
  | "finance"
  | "executive_management"
  | "reporting"
  | "gov_compliance";

export const DIMENSIONS: Dimension[] = [
  "operations",
  "project_workflow",
  "site_management",
  "finance",
  "executive_management",
  "reporting",
  "gov_compliance",
];

export type QuestionType = "mcq" | "yn_conditional" | "open";

export interface BilingualText {
  en: string;
  ar: string;
}

export interface OptionDef {
  key: "A" | "B" | "C" | "D";
  en: string;
  ar: string;
  score: number;
}

export interface FollowUpDef {
  id: string;
  type: "mcq";
  label_en: string;
  label_ar: string;
  options: OptionDef[];
}

export interface QuestionDef {
  id: string;
  dimension: Dimension;
  sectors: (Sector | "ALL")[];
  type: QuestionType;
  label_en: string;
  label_ar: string;
  options?: OptionDef[];
  yes_score?: number;
  no_score?: number;
  conditional_if?: "yes" | "no";
  follow_up?: FollowUpDef;
  scoring_rubric?: Record<string, string>;
}

export interface DimensionMeta {
  key: Dimension;
  label_en: string;
  label_ar: string;
  weight: number;
}

export interface QuestionBank {
  meta: {
    version: string;
    sectors: Sector[];
  };
  dimensions: DimensionMeta[];
  questions: QuestionDef[];
}

export interface AssessmentMeta {
  clientName: string;
  projectName?: string;
  sector: Sector;
  companySize: "lt50" | "50to200" | "gt200";
  assessorName: string;
  contactEmail?: string;
  contactPhone?: string;
  commercialRegistration?: string;
  city?: string;
  createdAt: string;
}

export interface ROISettings {
  engineersCount: number;
  workingDaysPerWeek: number;
  timeSavingRate: number;
  avgHourCostSar: number | null;
  dailyReportingHours: number;
}

/** MCQ: option key "A"|"B"|"C"|"D". yn_conditional: { answer: "yes"|"no", followUp?: "A"|"B"|"C"|"D" }. open: free text. */
export type AnswerValue =
  | string
  | null
  | { answer: "yes" | "no"; followUp?: string | null };

export type SyncStatus = "idle" | "pending" | "ok" | "error";

export interface SyncInfo {
  status: SyncStatus;
  assessmentId?: string;
  error?: string;
  syncedAt?: string;
}

export interface AssessmentState {
  meta: AssessmentMeta;
  answers: Record<string, AnswerValue>;
  roi: ROISettings;
  sync?: SyncInfo;
}
