export const AssetHealthStatus = ["NORMAL","WATCH","DEGRADED","DANGEROUS"] as const;
export type AssetHealthStatus = (typeof AssetHealthStatus)[number];
// 健康等级权重：数值越大越差，用于“取最重”比较。
export const AssetHealthStatusRank: Record<AssetHealthStatus, number> = { NORMAL: 0, WATCH: 1, DEGRADED: 2, DANGEROUS: 3 };
