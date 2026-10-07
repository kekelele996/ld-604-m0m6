import type { GridAsset, GridAssetHealthView, AssetHealthStats } from "../types/GridAsset";

export const createDefaultGridAsset = (overrides: Partial<GridAsset> = {}): GridAsset => ({
  id: 1 as never,
  asset_code: "asset code 1" as never,
  asset_type: "配电变压器" as never,
  feeder_line: "feeder line 1" as never,
  voltage_level: "10kV" as never,
  location_desc: "location desc 1" as never,
  health_status: "NORMAL" as never,
  owner_team_id: 1 as never,
  ...overrides
});

// 资产健康视图默认值：未复电故障重算前，当前健康即建档状态。
export const createGridAssetHealthView = (overrides: Partial<GridAssetHealthView> = {}): GridAssetHealthView => ({
  ...createDefaultGridAsset(),
  baseline_health_status: "NORMAL",
  health_status: "NORMAL",
  health_source: "BASELINE",
  open_fault_count: 0,
  open_fault_types: [],
  ...overrides
} as GridAssetHealthView);

export const createAssetHealthStats = (overrides: Partial<AssetHealthStats> = {}): AssetHealthStats => ({
  NORMAL: 0,
  WATCH: 0,
  DEGRADED: 0,
  DANGEROUS: 0,
  total: 0,
  fault_driven: 0,
  ...overrides
});

export const createGridAssetForm = createDefaultGridAsset;
export const createGridAssetResponse = createDefaultGridAsset;
