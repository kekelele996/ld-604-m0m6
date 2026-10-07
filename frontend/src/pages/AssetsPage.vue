<script setup lang="ts">
import { computed, onMounted } from "vue";
import StatusBadge from "../components/common/StatusBadge.vue";
import { useGridAssetStore } from "../stores/GridAssetStore";
import { useFaultReportStore } from "../stores/FaultReportStore";
import { useRepairTicketStore } from "../stores/RepairTicketStore";
import { useAssetHealth, AssetHealthSourceText } from "../hooks/useAssetHealth";
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
const { healthOf, sourceOf, openFaultCountOf } = useAssetHealth(assets, faults, tickets);
</script>

<template>
  <section class="panel wide">
    <h2>资产台账</h2>
    <table class="ledger">
      <thead>
        <tr><th>资产编码</th><th>所属线路</th><th>电压等级</th><th>安装位置</th><th>未复电故障</th><th>健康状态</th><th>判定依据</th></tr>
      </thead>
      <tbody>
        <tr v-for="asset in assets" :key="asset.id">
          <td>{{ asset.asset_code }}</td>
          <td>{{ asset.feeder_line }}</td>
          <td>{{ asset.voltage_level }}</td>
          <td>{{ asset.location_desc }}</td>
          <td>{{ openFaultCountOf(asset) }}</td>
          <td><StatusBadge :value="formatAssetHealth(healthOf(asset))" /></td>
          <td>{{ AssetHealthSourceText[sourceOf(asset)] }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
