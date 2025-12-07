// types/Report.ts
export type ImageMeta = { width: number; height: number };

export type DefectItem = {
  label: string;
  score: number;
  bbox?: [number, number, number, number];
};

export type Instance = {
  id: number;
  type: string; // 'tree' | 'shrub' | ...
  bbox: [number, number, number, number];
  mask_rle?: string | null;
  species?: { label: string; score: number } | null;
  defects: DefectItem[];
  dry_branches_pct?: number;    // 0..100
  severity_score?: number;      // 0..1
  conf?: number;
  healthScore?: number;
};

export type OverlayRef =
    | { mode: 'url'; value: string }
    | { mode: 'path'; value: string }
    | { mode: 'none'; value: '' }
    | { mode: string; value: string }; // на всякий

export type TableRow = {
  id: number;
  kind: string;
  species: string;
  defects: string;
  dry_branches_pct: number;
  notes?: string;
};

export type ServerResponse = {
  request_id: string;
  time_ms: number;
  image: ImageMeta;
  instances: Instance[];
  overlay: OverlayRef;
  table?: TableRow[];
};

export type Report = {
  id: string;
  date: string;
  imageFile: string; // file://
  payload: ServerResponse;
};
