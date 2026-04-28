import raw from "./questions.json";
import type {
  Dimension,
  DimensionMeta,
  FollowUpDef,
  OptionDef,
  QuestionBank,
  QuestionDef,
  Sector,
} from "./types";
import { DIMENSIONS } from "./types";

type RawOption = { en: string; ar: string; score: number };
type RawOptions = Record<"A" | "B" | "C" | "D", RawOption>;

type RawFollowUp = {
  id: string;
  type: "mcq";
  label_en: string;
  label_ar: string;
  options: RawOptions;
};

type RawQuestion = {
  id: string;
  sectors: (Sector | "ALL")[];
  type: "mcq" | "yn_conditional" | "open";
  label_en: string;
  label_ar: string;
  options?: RawOptions;
  yes_score?: number;
  no_score?: number;
  conditional_if?: "yes" | "no";
  follow_up?: RawFollowUp;
  scoring_rubric?: Record<string, string>;
};

type RawDimension = {
  label_en: string;
  label_ar: string;
  weight: number;
  questions: RawQuestion[];
};

type RawBank = {
  meta: { version: string; sectors: Sector[] };
  dimensions: Record<Dimension, RawDimension>;
};

function flattenOptions(opts: RawOptions): OptionDef[] {
  return (["A", "B", "C", "D"] as const)
    .filter((k) => opts[k])
    .map((k) => ({ key: k, ...opts[k] }));
}

function flattenFollowUp(fu: RawFollowUp): FollowUpDef {
  return {
    id: fu.id,
    type: "mcq",
    label_en: fu.label_en,
    label_ar: fu.label_ar,
    options: flattenOptions(fu.options),
  };
}

function buildBank(): QuestionBank {
  const r = raw as unknown as RawBank;
  const dimensions: DimensionMeta[] = DIMENSIONS.map((key) => ({
    key,
    label_en: r.dimensions[key].label_en,
    label_ar: r.dimensions[key].label_ar,
    weight: r.dimensions[key].weight,
  }));

  const questions: QuestionDef[] = [];
  for (const dim of DIMENSIONS) {
    for (const q of r.dimensions[dim].questions) {
      questions.push({
        id: q.id,
        dimension: dim,
        sectors: q.sectors,
        type: q.type,
        label_en: q.label_en,
        label_ar: q.label_ar,
        options: q.options ? flattenOptions(q.options) : undefined,
        yes_score: q.yes_score,
        no_score: q.no_score,
        conditional_if: q.conditional_if,
        follow_up: q.follow_up ? flattenFollowUp(q.follow_up) : undefined,
        scoring_rubric: q.scoring_rubric,
      });
    }
  }

  return {
    meta: { version: r.meta.version, sectors: r.meta.sectors },
    dimensions,
    questions,
  };
}

export const questionBank: QuestionBank = buildBank();

export function getQuestionsForSector(sector: Sector): QuestionDef[] {
  return questionBank.questions.filter(
    (q) => q.sectors.includes("ALL") || q.sectors.includes(sector),
  );
}

export function getDimensionMeta(dim: Dimension): DimensionMeta {
  return questionBank.dimensions.find((d) => d.key === dim)!;
}
