import { gridAssetRepository } from "../repositories/GridAssetRepository";
import { faultReportRepository } from "../repositories/FaultReportRepository";
import { repairTicketRepository } from "../repositories/RepairTicketRepository";
import { assetHealthService } from "./AssetHealthService";

export const gridAssetService = {
  list: () => assetHealthService.applyDerivedHealth(gridAssetRepository.findAll(), faultReportRepository.findAll(), repairTicketRepository.findAll()),
  create: (row: unknown) => gridAssetRepository.save(row)
};
