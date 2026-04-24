export type Role = "Manager" | "Engineer" | "Finance" | "Operations";

export type Axis =
  | "Process"
  | "DailyOps"
  | "Data"
  | "Finance"
  | "Governance"
  | "Decision"
  | "Automation"
  | "AIReadiness";

export type QuestionType = "single" | "multi" | "number" | "text";

export interface OptionDef {
  key: string;
  label: string;
  labelEn?: string;
  score?: number;
}

export interface QuestionDef {
  id: string;
  axis: Axis;
  role: Role | "All";
  type: QuestionType;
  text: string;
  textEn?: string;
  help?: string;
  helpEn?: string;
  weight?: number;
  options?: OptionDef[];
  scoringMap?: Record<string, number>;
  tags?: string[];
}

export interface AssessmentMeta {
  clientName: string;
  projectName?: string;
  companySize: "lt50" | "50to200" | "gt200";
  assessorName: string;
  contactEmail?: string;
  city?: string;
  createdAt: string;
}

export interface ROISettings {
  engineersCount: number;
  workingDaysPerWeek: number;
  timeSavingRate: number;
  avgHourCostSar: number | null;
}

export type AnswerValue = string | number | string[] | null;

export interface Respondent {
  id: string;
  role: Role;
  name?: string;
  answers: Record<string, AnswerValue>;
}

export type SyncStatus = "idle" | "pending" | "ok" | "error";

export interface SyncInfo {
  status: SyncStatus;
  assessmentId?: string;
  error?: string;
  syncedAt?: string;
}

export interface AssessmentState {
  meta: AssessmentMeta;
  respondents: Respondent[];
  activeRespondentId: string;
  roi: ROISettings;
  sync?: SyncInfo;
}
