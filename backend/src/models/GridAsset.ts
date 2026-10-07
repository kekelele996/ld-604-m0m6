export interface GridAsset { id: number; asset_code: string; asset_type: string; feeder_line: string; voltage_level: string; location_desc: string; health_status: string; owner_team_id: number }
export type HealthSource = "FAULT_DRIVEN" | "BASELINE";
// 台账/统计/工单详情统一使用的视图：health_status 为按未复电故障重算后的当前健康，baseline_health_status 为建档时状态。
export interface GridAssetHealthView extends GridAsset { baseline_health_status: string; health_source: HealthSource; open_fault_count: number; open_fault_types: string[] }
export interface AssetHealthStats { NORMAL: number; WATCH: number; DEGRADED: number; DANGEROUS: number; total: number; fault_driven: number }
