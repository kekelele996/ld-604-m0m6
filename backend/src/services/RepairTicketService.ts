import { repairTicketRepository } from "../repositories/RepairTicketRepository";
import { faultReportRepository } from "../repositories/FaultReportRepository";
import { gridAssetRepository } from "../repositories/GridAssetRepository";
import { assetHealthService } from "./AssetHealthService";
import { createRepairTicketAssetView } from "../constructors/RepairTicketDtoFactory";
import type { RepairTicketAssetView } from "../models/RepairTicket";

export const repairTicketService = {
  // 工单列表/详情：关联资产的健康状态与资产台账同一套未复电故障口径。
  list: (): RepairTicketAssetView[] => {
    const tickets = repairTicketRepository.findAll();
    const reports = faultReportRepository.findAll();
    const assets = assetHealthService.deriveAll(gridAssetRepository.findAll(), reports, tickets);
    const assetById = new Map(assets.map((asset) => [asset.id, asset]));
    const reportById = new Map(reports.map((report) => [report.id, report]));
    return tickets.map((ticket) => {
      const report = reportById.get(ticket.fault_report_id);
      const asset = report ? assetById.get(report.asset_id) : undefined;
      return createRepairTicketAssetView({
        ...ticket,
        fault_type: report?.fault_type ?? null,
        asset_id: asset?.id ?? null,
        asset_code: asset?.asset_code ?? null,
        asset_health_status: asset?.health_status ?? null,
        asset_health_source: asset?.health_source ?? null
      }) as RepairTicketAssetView;
    });
  },
  create: (row: unknown) => repairTicketRepository.save(row)
};
