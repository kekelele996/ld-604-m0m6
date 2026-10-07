<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useGridAssetStore } from "../stores/GridAssetStore";
import { AssetHealthStatus, AssetHealthStatusText, AssetHealthStatusRank } from "../constants/AssetHealthStatus";
import { HEALTH_RULE_NOTE } from "../constants/AssetHealthRule";
import { formatFaultTypes } from "../utils/formatters";
import StatCard from "../components/common/StatCard.vue";
import StatusBadge from "../components/common/StatusBadge.vue";

const store = useGridAssetStore();
onMounted(() => store.load());

const stats = computed(() => store.stats);
// 该往前排的资产：健康状态被未复电故障拉高的，按等级从重到轻排。
const watchlist = computed(() =>
  store.rows
    .filter((row) => row.health_source === "FAULT_DRIVEN")
    .sort((a, b) => AssetHealthStatusRank[b.health_status] - AssetHealthStatusRank[a.health_status])
);
</script>

<template>
  <section class="metrics">
    <StatCard v-for="status in AssetHealthStatus" :key="status" :label="`资产健康·${AssetHealthStatusText[status]}`" :value="stats?.[status] ?? 0" />
  </section>
  <section class="workbench">
    <div class="panel wide">
      <h2>该往前排的资产</h2>
      <article class="row" v-for="row in watchlist" :key="row.id">
        <strong>{{ row.asset_code }} · {{ row.feeder_line }}</strong>
        <span>{{ formatFaultTypes(row.open_fault_types) }}（{{ row.open_fault_count }} 起未复电）</span>
        <StatusBadge :value="row.health_status" :text="AssetHealthStatusText[row.health_status]" />
      </article>
      <p v-if="!watchlist.length" class="note">当前没有未复电故障，全部资产按建档状态运行。</p>
    </div>
    <div class="panel">
      <h2>判定口径</h2>
      <p>{{ HEALTH_RULE_NOTE }}</p>
      <p class="note">台账共 {{ stats?.total ?? 0 }} 台资产，其中 {{ stats?.fault_driven ?? 0 }} 台当前健康由未复电故障拉高。</p>
    </div>
  </section>
</template>
