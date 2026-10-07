import { mockData } from "../mocks/seedData";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { deriveAllAssetHealth, summarizeAssetHealth } from "../utils/assetHealth";
import type { FaultReport } from "../types/FaultReport";
import type { GridAsset, GridAssetHealthView, AssetHealthStats } from "../types/GridAsset";
import type { RepairTicket } from "../types/RepairTicket";

const endpoint = "/api/grid-asset";

// 离线兜底时用同一套未复电故障口径在本地重算，保证台账显示不走样。
const localHealthViews = () => {
  console.info(LOG_TEMPLATES.GridAsset[4]);
  return deriveAllAssetHealth(
    mockData.gridAsset as unknown as GridAsset[],
    mockData.faultReport as unknown as FaultReport[],
    mockData.repairTicket as unknown as RepairTicket[]
  );
};

export async function listGridAsset(): Promise<GridAssetHealthView[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return localHealthViews();
}

export async function listGridAssetHealthStats(): Promise<AssetHealthStats> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(`${endpoint}/health-stats`);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return summarizeAssetHealth(localHealthViews());
}

export async function saveGridAsset(payload: GridAsset) {
  console.info("save GridAsset", payload);
  return payload;
}
