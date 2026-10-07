import type { AssetHealthStatus } from "../constants/AssetHealthStatus";
import type { FaultType } from "../constants/FaultType";
import type { HealthSource } from "../constants/AssetHealthRule";

export interface RepairTicket {
  id: number;
  fault_report_id: number;
  team_id: number;
  dispatcher_id: number;
  priority: string;
  status: string;
  assigned_at: string | null;
  restored_at: string | null;
}

// 工单详情视图：关联资产当前健康（按未复电故障重算）随单一同返回。
export interface RepairTicketAssetView extends RepairTicket {
  fault_type: FaultType | null;
  asset_id: number | null;
  asset_code: string | null;
  asset_health_status: AssetHealthStatus | null;
  asset_health_source: HealthSource | null;
}
