import type { AssetHealthStatus } from "./AssetHealthStatus";
import type { FaultType } from "./FaultType";

// 故障类型 → 健康等级映射：设备损坏、安全隐患最重，跳闸、停电次之，低电压仅列入关注。
// 与后端 backend/src/constants/AssetHealthRule.ts 保持同一口径。
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
export const HealthSourceText: Record<HealthSource, string> = { FAULT_DRIVEN: "故障驱动", BASELINE: "建档基线" };

// 判定口径说明：资产台账、抢修态势统计、工单详情共用这一句话。
export const HEALTH_RULE_NOTE = "健康状态按该资产未复电的故障取最重等级（设备损坏/安全隐患＞跳闸/停电＞低电压），且不低于建档状态；全部复电后回到建档状态，未登记过故障的资产沿用建档状态。";
