<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import StatusBadge from "../components/common/StatusBadge.vue";
import EmptyState from "../components/common/EmptyState.vue";
import { useGridAssetStore } from "../stores/GridAssetStore";
import { useFaultReportStore } from "../stores/FaultReportStore";
import { useRepairTicketStore } from "../stores/RepairTicketStore";
import { useAssetHealth, AssetHealthSourceText } from "../hooks/useAssetHealth";
import { formatAssetHealth, formatFaultType, formatTicketStatus, formatDate } from "../utils/formatters";
import type { RepairTicket } from "../types/RepairTicket";

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
const { healthOf, sourceOf, openFaultCountOf } = useAssetHealth(assets, faults, tickets);

const selectedId = ref<number | null>(null);
const selected = computed(() => tickets.value.find((row) => row.id === selectedId.value) ?? tickets.value[0] ?? null);
const faultOf = (ticket: RepairTicket) => faults.value.find((row) => row.id === ticket.fault_report_id) ?? null;
const assetOf = (ticket: RepairTicket) => {
  const fault = faultOf(ticket);
  return assets.value.find((row) => row.id === fault?.asset_id) ?? null;
};
const selectedFault = computed(() => (selected.value ? faultOf(selected.value) : null));
const selectedAsset = computed(() => (selected.value ? assetOf(selected.value) : null));
</script>

<template>
  <section class="workbench">
    <div class="panel wide">
      <h2>抢修工单</h2>
      <article
        class="row selectable"
        v-for="ticket in tickets"
        :key="ticket.id"
        :class="{ active: selected?.id === ticket.id }"
        @click="selectedId = ticket.id"
      >
        <strong>工单 #{{ ticket.id }}</strong>
        <span>{{ formatFaultType(faultOf(ticket)?.fault_type) }}</span>
        <StatusBadge :value="formatTicketStatus(ticket.status)" />
      </article>
      <EmptyState v-if="tickets.length === 0" />
    </div>
    <div class="panel">
      <h2>工单详情</h2>
      <dl class="detail" v-if="selected">
        <dt>工单编号</dt><dd>#{{ selected.id }}</dd>
        <dt>工单状态</dt><dd><StatusBadge :value="formatTicketStatus(selected.status)" /></dd>
        <dt>故障类型</dt><dd>{{ formatFaultType(selectedFault?.fault_type) }}</dd>
        <dt>派工时间</dt><dd>{{ formatDate(selected.assigned_at) }}</dd>
        <dt>关联资产</dt><dd>{{ selectedAsset?.asset_code ?? "-" }}</dd>
        <dt>资产健康</dt>
        <dd><StatusBadge v-if="selectedAsset" :value="formatAssetHealth(healthOf(selectedAsset))" /><span v-else>-</span></dd>
        <dt>判定依据</dt><dd>{{ selectedAsset ? AssetHealthSourceText[sourceOf(selectedAsset)] : "-" }}</dd>
        <dt>未复电故障</dt><dd>{{ selectedAsset ? openFaultCountOf(selectedAsset) : "-" }}</dd>
      </dl>
      <EmptyState v-else />
    </div>
  </section>
</template>
