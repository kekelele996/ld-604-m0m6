import { AssetHealthStatus, AssetHealthStatusRank } from "../constants/AssetHealthStatus";
import { FAULT_TYPE_HEALTH_MAP, RESTORED_TICKET_STATUSES } from "../constants/AssetHealthRule";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { FaultType } from "../constants/FaultType";
import { createGridAssetHealthView, createAssetHealthStats } from "../constructors/GridAssetDtoFactory";
import type { GridAsset, GridAssetHealthView, AssetHealthStats } from "../models/GridAsset";
import type { FaultReport } from "../models/FaultReport";
import type { RepairTicket } from "../models/RepairTicket";

const restoredStatuses: ReadonlySet<string> = new Set(RESTORED_TICKET_STATUSES);

// 判定口径：以该资产尚未复电的故障为准。
// 报修没有任何一张工单进入 RESTORED/CLOSED（含尚未派工的）即视为未复电；
// 全部复电后健康状态回到建档值，从未登记故障的资产始终沿用建档值。
const isReportUnrestored = (report: FaultReport, tickets: ReadonlyArray<RepairTicket>) =>
  !tickets.some((ticket) => ticket.fault_report_id === report.id && restoredStatuses.has(ticket.status));

const rankOf = (status: string) => AssetHealthStatusRank[status as AssetHealthStatus] ?? 0;

export const assetHealthService = {
  derive(asset: GridAsset, reports: ReadonlyArray<FaultReport>, tickets: ReadonlyArray<RepairTicket>): GridAssetHealthView {
    const openTypes = reports
      .filter((report) => report.asset_id === asset.id && isReportUnrestored(report, tickets))
      .map((report) => report.fault_type as FaultType);
    let effective = asset.health_status;
    for (const faultType of openTypes) {
      const mapped = FAULT_TYPE_HEALTH_MAP[faultType];
      if (rankOf(mapped) > rankOf(effective)) effective = mapped;
    }
    return createGridAssetHealthView({
      ...asset,
      baseline_health_status: asset.health_status,
      health_status: effective,
      health_source: openTypes.length > 0 && effective !== asset.health_status ? "FAULT_DRIVEN" : "BASELINE",
      open_fault_count: openTypes.length,
      open_fault_types: [...new Set(openTypes)]
    }) as GridAssetHealthView;
  },
  deriveAll(assets: ReadonlyArray<GridAsset>, reports: ReadonlyArray<FaultReport>, tickets: ReadonlyArray<RepairTicket>): GridAssetHealthView[] {
    console.info(LOG_TEMPLATES.GridAsset[4], `assets=${assets.length}`);
    return assets.map((asset) => assetHealthService.derive(asset, reports, tickets));
  },
  summarize(views: ReadonlyArray<GridAssetHealthView>): AssetHealthStats {
    const stats = createAssetHealthStats({ total: views.length }) as AssetHealthStats;
    for (const view of views) {
      if ((AssetHealthStatus as readonly string[]).includes(view.health_status)) stats[view.health_status as AssetHealthStatus] += 1;
      if (view.health_source === "FAULT_DRIVEN") stats.fault_driven += 1;
    }
    return stats;
  }
};
