export const AssetHealthStatus = ["NORMAL","WATCH","DEGRADED","DANGEROUS"] as const;
export type AssetHealthStatus = (typeof AssetHealthStatus)[number];
export const AssetHealthStatusText: Record<AssetHealthStatus, string> = { NORMAL: "正常", WATCH: "关注", DEGRADED: "劣化", DANGEROUS: "危险" };
// 健康等级权重：数值越大越差，用于“取最重”比较和台账排序。
export const AssetHealthStatusRank: Record<AssetHealthStatus, number> = { NORMAL: 0, WATCH: 1, DEGRADED: 2, DANGEROUS: 3 };
