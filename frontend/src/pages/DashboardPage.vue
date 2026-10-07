<script setup lang="ts">
import { computed, onMounted } from "vue";
import StatCard from "../components/common/StatCard.vue";
import StatusBadge from "../components/common/StatusBadge.vue";
import EmptyState from "../components/common/EmptyState.vue";
import { useGridAssetStore } from "../stores/GridAssetStore";
import { useFaultReportStore } from "../stores/FaultReportStore";
import { useRepairTicketStore } from "../stores/RepairTicketStore";
import { useAssetHealth } from "../hooks/useAssetHealth";
import { formatAssetHealth } from "../utils/formatters";

const assetStore = useGridAssetStore();
const faultStore = useFaultReportStore();
const ticketStore = useRepairTicketStore();
onMounted(() => {
  void assetStore.load();
  void faultStore.load();
  void ticketStore.load();
});

const assets = computed(() => assetStore.rows);
const faults = computed(() => faultStore.rows);
const tickets = computed(() => ticketStore.rows);
const { healthOf, openFaultCountOf, stats, ranked } = useAssetHealth(assets, faults, tickets);
const attention = computed(() => ranked.value.filter((asset) => healthOf(asset) !== "NORMAL"));
</script>

<template>
  <section class="metrics four">
    <StatCard label="正常" :value="stats.NORMAL" />
    <StatCard label="关注" :value="stats.WATCH" />
    <StatCard label="降级" :value="stats.DEGRADED" />
    <StatCard label="危险" :value="stats.DANGEROUS" />
  </section>
  <section class="panel wide">
    <h2>资产健康优先关注</h2>
    <article class="row" v-for="asset in attention" :key="asset.id">
      <strong>{{ asset.asset_code }}</strong>
      <span>{{ asset.feeder_line }} · 未复电故障 {{ openFaultCountOf(asset) }} 起</span>
      <StatusBadge :value="formatAssetHealth(healthOf(asset))" />
    </article>
    <EmptyState v-if="attention.length === 0" />
  </section>
</template>
