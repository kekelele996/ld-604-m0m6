import type { AssetHealthStatus } from "./AssetHealthStatus";
import type { FaultType } from "./FaultType";

// 故障类型 → 健康等级映射：设备损坏、安全隐患最重，跳闸、停电次之，低电压仅列入关注。
export const FAULT_TYPE_HEALTH_MAP: Record<FaultType, AssetHealthStatus> = {
  VOLTAGE_LOW: "WATCH",
  OUTAGE: "DEGRADED",
  TRIP: "DEGRADED",
  EQUIPMENT_DAMAGE: "DANGEROUS",
  SAFETY_RISK: "DANGEROUS"
};

// 工单进入这些状态即视为对应故障已复电。
export const RESTORED_TICKET_STATUSES = ["RESTORED", "CLOSED"] as const;

// 健康状态来源：FAULT_DRIVEN = 被未复电故障拉高；BASELINE = 沿用建档状态。
export const HealthSource = ["FAULT_DRIVEN", "BASELINE"] as const;
export type HealthSource = (typeof HealthSource)[number];
