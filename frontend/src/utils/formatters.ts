import { AssetHealthStatusLabel, type AssetHealthStatus } from "../constants/AssetHealthStatus";
import { FaultTypeLabel, type FaultType } from "../constants/FaultType";
import { TicketStatusLabel, type TicketStatus } from "../constants/TicketStatus";

export const formatDate = (value: string) => new Date(value).toLocaleString("zh-CN");
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) => ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);
export const formatAssetHealth = (value?: string | null) => (value ? AssetHealthStatusLabel[value as AssetHealthStatus] ?? value : "-");
export const formatFaultType = (value?: string | null) => (value ? FaultTypeLabel[value as FaultType] ?? value : "-");
export const formatTicketStatus = (value?: string | null) => (value ? TicketStatusLabel[value as TicketStatus] ?? value : "-");
