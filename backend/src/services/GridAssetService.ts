import { gridAssetRepository } from "../repositories/GridAssetRepository";
import { faultReportRepository } from "../repositories/FaultReportRepository";
import { repairTicketRepository } from "../repositories/RepairTicketRepository";
import { assetHealthService } from "./AssetHealthService";

const healthViews = () => assetHealthService.deriveAll(gridAssetRepository.findAll(), faultReportRepository.findAll(), repairTicketRepository.findAll());

export const gridAssetService = {
  // 台账列表：health_status 已是按未复电故障重算后的当前健康。
  list: () => healthViews(),
  // 抢修态势的资产健康统计：与台账同一套判定口径。
  healthStats: () => assetHealthService.summarize(healthViews()),
  create: (row: unknown) => gridAssetRepository.save(row)
};
