import { defineStore } from "pinia";
import { listGridAsset, listGridAssetHealthStats } from "../api/GridAsset";
import type { AssetHealthStats } from "../types/GridAsset";
export const useGridAssetStore = defineStore("gridAsset", {
  state: () => ({ rows: [] as Awaited<ReturnType<typeof listGridAsset>>, stats: null as AssetHealthStats | null, loading: false }),
  actions: { async load() { this.loading = true; const [rows, stats] = await Promise.all([listGridAsset(), listGridAssetHealthStats()]); this.rows = rows; this.stats = stats; this.loading = false; } }
});
