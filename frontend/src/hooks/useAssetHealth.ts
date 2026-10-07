import { computed, type Ref } from "vue";
import { AssetHealthStatus } from "../constants/AssetHealthStatus";
import { FAULT_TYPE_HEALTH, RESTORED_TICKET_STATUSES } from "../constants/AssetHealthRules";
import type { FaultType } from "../constants/FaultType";
import type { GridAsset } from "../types/GridAsset";
import type { FaultReport } from "../types/FaultReport";
import type { RepairTicket } from "../types/RepairTicket";

export type AssetHealthSource = "OPEN_FAULT" | "RESTORED" | "BASELINE";

export const AssetHealthSourceText: Record<AssetHealthSource, string> = {
  OPEN_FAULT: "未复电故障",
  RESTORED: "复电后回正常",
  BASELINE: "建档状态"
};

export interface AssetHealthResolution {
  status: AssetHealthStatus;
  source: AssetHealthSource;
  openFaultCount: number;
}

// 未复电 = 没有关联工单，或工单状态不在 RESTORED / CLOSED。
const isUnrestored = (fault: FaultReport, tickets: RepairTicket[]): boolean => {
  const ticket = tickets.find((row) => row.fault_report_id === fault.id);
  return !ticket || !(RESTORED_TICKET_STATUSES as readonly string[]).includes(ticket.status);
};

// 健康状态跟着故障走：以该资产未复电的故障为准，取最重故障类型定级；
// 全部复电后回 NORMAL；从未登过故障的资产仍用建档时的 health_status。
export function resolveAssetHealth(asset: GridAsset, faults: FaultReport[], tickets: RepairTicket[]): AssetHealthResolution {
  const assetFaults = faults.filter((row) => row.asset_id === asset.id);
  if (assetFaults.length === 0) {
    const baseline = (AssetHealthStatus as readonly string[]).includes(asset.health_status) ? (asset.health_status as AssetHealthStatus) : "NORMAL";
    return { status: baseline, source: "BASELINE", openFaultCount: 0 };
  }
  const openFaults = assetFaults.filter((fault) => isUnrestored(fault, tickets));
  if (openFaults.length === 0) return { status: "NORMAL", source: "RESTORED", openFaultCount: 0 };
  let worst: AssetHealthStatus = "NORMAL";
  for (const fault of openFaults) {
    const mapped = FAULT_TYPE_HEALTH[fault.fault_type as FaultType] ?? "WATCH";
    if (AssetHealthStatus.indexOf(mapped) > AssetHealthStatus.indexOf(worst)) worst = mapped;
  }
  return { status: worst, source: "OPEN_FAULT", openFaultCount: openFaults.length };
}

export function useAssetHealth(assets: Readonly<Ref<GridAsset[]>>, faults: Readonly<Ref<FaultReport[]>>, tickets: Readonly<Ref<RepairTicket[]>>) {
  const resolutions = computed(() => {
    const map = new Map<number, AssetHealthResolution>();
    for (const asset of assets.value) map.set(asset.id, resolveAssetHealth(asset, faults.value, tickets.value));
    return map;
  });
  const resolutionOf = (asset: GridAsset): AssetHealthResolution =>
    resolutions.value.get(asset.id) ?? resolveAssetHealth(asset, faults.value, tickets.value);
  const healthOf = (asset: GridAsset): AssetHealthStatus => resolutionOf(asset).status;
  const sourceOf = (asset: GridAsset): AssetHealthSource => resolutionOf(asset).source;
  const openFaultCountOf = (asset: GridAsset): number => resolutionOf(asset).openFaultCount;
  const stats = computed((): Record<AssetHealthStatus, number> => {
    const acc: Record<AssetHealthStatus, number> = { NORMAL: 0, WATCH: 0, DEGRADED: 0, DANGEROUS: 0 };
    for (const asset of assets.value) acc[healthOf(asset)] += 1;
    return acc;
  });
  const ranked = computed(() =>
    [...assets.value].sort((a, b) => AssetHealthStatus.indexOf(healthOf(b)) - AssetHealthStatus.indexOf(healthOf(a)))
  );
  return { resolutions, resolutionOf, healthOf, sourceOf, openFaultCountOf, stats, ranked };
}
