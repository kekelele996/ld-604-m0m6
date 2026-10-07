import type { AssetHealthStatus } from "./AssetHealthStatus";
import type { FaultType } from "./FaultType";
import type { TicketStatus } from "./TicketStatus";

// 故障类型 -> 健康等级权重：跳闸(TRIP)、设备损坏(EQUIPMENT_DAMAGE) 比低电压(VOLTAGE_LOW)重。
export const FAULT_TYPE_HEALTH: Record<FaultType, AssetHealthStatus> = {
  VOLTAGE_LOW: "WATCH",
  OUTAGE: "DEGRADED",
  TRIP: "DEGRADED",
  EQUIPMENT_DAMAGE: "DANGEROUS",
  SAFETY_RISK: "DANGEROUS"
};

// 关联工单进入这些状态即视为该故障已复电。
export const RESTORED_TICKET_STATUSES: readonly TicketStatus[] = ["RESTORED", "CLOSED"];
