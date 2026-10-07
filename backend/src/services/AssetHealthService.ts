import { AssetHealthStatus } from "../constants/AssetHealthStatus";
import { FAULT_TYPE_HEALTH, RESTORED_TICKET_STATUSES } from "../constants/AssetHealthRules";
import type { FaultType } from "../constants/FaultType";
import type { GridAsset } from "../models/GridAsset";
import type { FaultReport } from "../models/FaultReport";
import type { RepairTicket } from "../models/RepairTicket";

// 未复电 = 没有关联工单，或工单状态不在 RESTORED / CLOSED。
const isUnrestored = (fault: FaultReport, tickets: readonly RepairTicket[]): boolean => {
  const ticket = tickets.find((row) => row.fault_report_id === fault.id);
  return !ticket || !(RESTORED_TICKET_STATUSES as readonly string[]).includes(ticket.status);
};

// 健康状态跟着故障走：以该资产未复电的故障为准，取最重故障类型定级；
// 全部复电后回 NORMAL；从未登过故障的资产仍用建档时的 health_status。
const derive = (asset: GridAsset, faults: readonly FaultReport[], tickets: readonly RepairTicket[]): AssetHealthStatus => {
  const assetFaults = faults.filter((row) => row.asset_id === asset.id);
  if (assetFaults.length === 0) {
    return (AssetHealthStatus as readonly string[]).includes(asset.health_status) ? (asset.health_status as AssetHealthStatus) : "NORMAL";
  }
  const openFaults = assetFaults.filter((fault) => isUnrestored(fault, tickets));
  if (openFaults.length === 0) return "NORMAL";
  let worst: AssetHealthStatus = "NORMAL";
  for (const fault of openFaults) {
    const mapped = FAULT_TYPE_HEALTH[fault.fault_type as FaultType] ?? "WATCH";
    if (AssetHealthStatus.indexOf(mapped) > AssetHealthStatus.indexOf(worst)) worst = mapped;
  }
  return worst;
};

export const assetHealthService = {
  derive,
  applyDerivedHealth: (assets: readonly GridAsset[], faults: readonly FaultReport[], tickets: readonly RepairTicket[]): GridAsset[] =>
    assets.map((asset) => ({ ...asset, health_status: derive(asset, faults, tickets) }))
};
