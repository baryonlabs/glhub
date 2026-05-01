export const COMPANY_ID_RE = /^[A-Za-z0-9_-]+$/;
export const GENERATION_ID_RE = /^gen-\d{8}-\d{3}$/;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type GenerationRecord = {
  id: string;
  parent_id?: string | null;
  created_at?: string;
  soul?: string;
  gains?: string[];
  losses?: string[];
  philosophical_note?: string | null;
  metrics?: {
    score?: number;
    execution_time_s?: number | null;
    success?: boolean;
  };
  tags?: string[];
  config_patch?: JsonValue;
  config_patches?: JsonValue[];
  retrospective?: {
    do_not?: string[];
    do?: string[];
    skills?: string[];
    bugs_fixed?: string[];
    cases?: Array<{ name?: string; impact?: string }>;
  };
};

export type LineageNode = {
  id: string;
  parent_id?: string | null;
  soul?: string;
  score?: number;
  success?: boolean;
  created_at?: string;
  tags?: string[];
};

export type LineageResult = {
  nodes: LineageNode[];
  edges: Array<{ from: string; to: string; relation_type: string; created_at: string }>;
};

export type PushPayload = {
  schema_version?: string;
  company_id?: string;
  pushed_at?: string;
  status?: JsonValue;
  lineage?: JsonValue;
  generations?: JsonValue[];
  relations?: JsonValue[];
};
