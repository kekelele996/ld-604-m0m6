<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRepairTicketStore } from "../stores/RepairTicketStore";
import { TicketStatusText } from "../constants/TicketStatus";
import { AssetHealthStatusText } from "../constants/AssetHealthStatus";
import { FaultTypeText } from "../constants/FaultType";
import { HealthSourceText, HEALTH_RULE_NOTE } from "../constants/AssetHealthRule";
import { formatDate, formatDateOrPending } from "../utils/formatters";
import StatusBadge from "../components/common/StatusBadge.vue";

const store = useRepairTicketStore();
onMounted(() => store.load());

const selectedId = ref<number | null>(null);
const selected = computed(() => store.rows.find((row) => row.id === selectedId.value) ?? store.rows[0] ?? null);
const ticketStatusText = (status: string) => TicketStatusText[status as keyof typeof TicketStatusText] ?? status;
</script>

<template>
  <section class="panel wide">
    <h2>抢修工单</h2>
    <table class="table">
      <thead>
        <tr><th>工单号</th><th>故障类型</th><th>关联资产</th><th>优先级</th><th>工单状态</th><th>派工时间</th><th>复电时间</th><th>资产当前健康</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in store.rows" :key="row.id" :class="{ selected: selected?.id === row.id }" @click="selectedId = row.id">
          <td>#{{ row.id }}</td>
          <td>{{ row.fault_type ? FaultTypeText[row.fault_type] : "—" }}</td>
          <td>{{ row.asset_code ?? "—" }}</td>
          <td>{{ row.priority }}</td>
          <td><StatusBadge :value="row.status" :text="ticketStatusText(row.status)" /></td>
          <td>{{ row.assigned_at ? formatDate(row.assigned_at) : "待派工" }}</td>
          <td>{{ formatDateOrPending(row.restored_at) }}</td>
          <td><StatusBadge v-if="row.asset_health_status" :value="row.asset_health_status" :text="AssetHealthStatusText[row.asset_health_status]" /><span v-else>—</span></td>
        </tr>
      </tbody>
    </table>
  </section>
  <section v-if="selected" class="panel">
    <h2>工单详情 · #{{ selected.id }}</h2>
    <dl class="detail">
      <dt>关联资产</dt><dd>{{ selected.asset_code ?? "—" }}</dd>
      <dt>故障类型</dt><dd>{{ selected.fault_type ? FaultTypeText[selected.fault_type] : "—" }}</dd>
      <dt>工单状态</dt><dd>{{ ticketStatusText(selected.status) }}</dd>
      <dt>资产当前健康</dt>
      <dd>
        <StatusBadge v-if="selected.asset_health_status" :value="selected.asset_health_status" :text="AssetHealthStatusText[selected.asset_health_status]" />
        <span v-else>—</span>
        <template v-if="selected.asset_health_source">（{{ HealthSourceText[selected.asset_health_source] }}）</template>
      </dd>
    </dl>
    <p class="note">{{ HEALTH_RULE_NOTE }}</p>
  </section>
</template>
