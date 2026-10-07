import { mockData } from "../mocks/seedData";
import { deriveAllAssetHealth } from "../utils/assetHealth";
import type { FaultReport } from "../types/FaultReport";
import type { GridAsset } from "../types/GridAsset";
import type { RepairTicket, RepairTicketAssetView } from "../types/RepairTicket";

const endpoint = "/api/repair-ticket";

// 离线兜底时按同一套未复电故障口径补齐关联资产健康，保证工单详情显示不走样。
const localTicketViews = (): RepairTicketAssetView[] => {
  const reports = mockData.faultReport as unknown as FaultReport[];
  const tickets = mockData.repairTicket as unknown as RepairTicket[];
  const assets = deriveAllAssetHealth(mockData.gridAsset as unknown as GridAsset[], reports, tickets);
  const assetById = new Map(assets.map((asset) => [asset.id, asset]));
  const reportById = new Map(reports.map((report) => [report.id, report]));
  return tickets.map((ticket) => {
    const report = reportById.get(ticket.fault_report_id);
    const asset = report ? assetById.get(report.asset_id) : undefined;
    return {
      ...ticket,
      fault_type: (report?.fault_type as RepairTicketAssetView["fault_type"]) ?? null,
      asset_id: asset?.id ?? null,
      asset_code: asset?.asset_code ?? null,
      asset_health_status: asset?.health_status ?? null,
      asset_health_source: asset?.health_source ?? null
    };
  });
};

export async function listRepairTicket(): Promise<RepairTicketAssetView[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return localTicketViews();
}

export async function saveRepairTicket(payload: RepairTicket) {
  console.info("save RepairTicket", payload);
  return payload;
}
