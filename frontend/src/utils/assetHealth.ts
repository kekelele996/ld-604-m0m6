import { AssetHealthStatusRank, type AssetHealthStatus } from "../constants/AssetHealthStatus";
import { FAULT_TYPE_HEALTH_MAP, RESTORED_TICKET_STATUSES } from "../constants/AssetHealthRule";
import type { FaultType } from "../constants/FaultType";
import type { FaultReport } from "../types/FaultReport";
import type { GridAsset, GridAssetHealthView, AssetHealthStats } from "../types/GridAsset";
import type { RepairTicket } from "../types/RepairTicket";

const restoredStatuses: ReadonlySet<string> = new Set(RESTORED_TICKET_STATUSES);

// 判定口径：以该资产尚未复电的故障为准。
// 报修没有任何一张工单进入 RESTORED/CLOSED（含尚未派工的）即视为未复电；
// 全部复电后健康状态回到建档值，从未登记故障的资产始终沿用建档值。
// 与后端 backend/src/services/AssetHealthService.ts 保持同一口径。
const isReportUnrestored = (report: FaultReport, tickets: ReadonlyArray<RepairTicket>) =>
  !tickets.some((ticket) => ticket.fault_report_id === report.id && restoredStatuses.has(ticket.status));

const rankOf = (status: string) => AssetHealthStatusRank[status as AssetHealthStatus] ?? 0;

export function deriveAssetHealth(
  asset: GridAsset,
  reports: ReadonlyArray<FaultReport>,
  tickets: ReadonlyArray<RepairTicket>
): GridAssetHealthView {
  const openTypes = reports
    .filter((report) => report.asset_id === asset.id && isReportUnrestored(report, tickets))
    .map((report) => report.fault_type as FaultType);
  let effective = asset.health_status as AssetHealthStatus;
  for (const faultType of openTypes) {
    const mapped = FAULT_TYPE_HEALTH_MAP[faultType];
    if (rankOf(mapped) > rankOf(effective)) effective = mapped;
  }
  return {
    ...asset,
    baseline_health_status: asset.health_status as AssetHealthStatus,
    health_status: effective,
    health_source: openTypes.length > 0 && effective !== asset.health_status ? "FAULT_DRIVEN" : "BASELINE",
    open_fault_count: openTypes.length,
    open_fault_types: [...new Set(openTypes)]
  };
}

export function deriveAllAssetHealth(
  assets: ReadonlyArray<GridAsset>,
  reports: ReadonlyArray<FaultReport>,
  tickets: ReadonlyArray<RepairTicket>
): GridAssetHealthView[] {
  return assets.map((asset) => deriveAssetHealth(asset, reports, tickets));
}

export function summarizeAssetHealth(views: ReadonlyArray<GridAssetHealthView>): AssetHealthStats {
  const stats: AssetHealthStats = { NORMAL: 0, WATCH: 0, DEGRADED: 0, DANGEROUS: 0, total: views.length, fault_driven: 0 };
  for (const view of views) {
    if (view.health_status in AssetHealthStatusRank) stats[view.health_status] += 1;
    if (view.health_source === "FAULT_DRIVEN") stats.fault_driven += 1;
  }
  return stats;
}
