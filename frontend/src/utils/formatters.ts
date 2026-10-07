import { FaultTypeText } from "../constants/FaultType";
import type { FaultType } from "../constants/FaultType";

export const formatDate = (value: string) => new Date(value).toLocaleString("zh-CN");
export const formatDateOrPending = (value: string | null, pending = "未复电") => (value ? formatDate(value) : pending);
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) => ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);
export const formatFaultTypes = (types: ReadonlyArray<FaultType>) => (types.length ? types.map((type) => FaultTypeText[type] ?? type).join("、") : "—");
