export const AssetHealthStatus = ["NORMAL","WATCH","DEGRADED","DANGEROUS"] as const;
export type AssetHealthStatus = (typeof AssetHealthStatus)[number];
export const AssetHealthStatusText: Record<AssetHealthStatus, string> = Object.fromEntries(AssetHealthStatus.map((value) => [value, value.replace(/_/g, " ")])) as Record<AssetHealthStatus, string>;
export const AssetHealthStatusLabel: Record<AssetHealthStatus, string> = {
  NORMAL: "正常",
  WATCH: "关注",
  DEGRADED: "降级",
  DANGEROUS: "危险"
};
