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
  key: string;              // stored value
  label: string;            // shown to user (AR)
  labelEn?: string;         // shown to user (EN)
  score?: number;           // optional direct scoring (override scoringMap)
}

export interface QuestionDef {
  id: string;
  axis: Axis;
  role: Role | "All";
  type: QuestionType;
  text: string;             // AR
  textEn?: string;          // EN
  help?: string;            // AR
  helpEn?: string;          // EN
  weight?: number;          // default 1
  options?: OptionDef[];    // for single/multi
  scoringMap?: Record<string, number>; // value -> score
  tags?: string[];          // e.g. ["whatsapp","reporting","compliance"]
}

export interface AssessmentMeta {
  clientName: string;
  projectName?: string;
  companySize: "lt50" | "50to200" | "gt200";
  assessorName: string;
  createdAt: string; // ISO
}

export interface ROISettings {
  engineersCount: number;      // used for time calculations
  workingDaysPerWeek: number;  // 5 by default
  timeSavingRate: number;      // 0.25 default (25%)
  avgHourCostSar: number | null; // optional override; if null use finance answer
}

export type AnswerValue = string | number | string[] | null;

export interface Respondent {
  id: string;
  role: Role;
  name?: string;
  answers: Record<string, AnswerValue>;
}

export interface AssessmentState {
  meta: AssessmentMeta;
  respondents: Respondent[];     // bundle: multiple roles
  activeRespondentId: string;    // currently answering for this role
  roi: ROISettings;
}
