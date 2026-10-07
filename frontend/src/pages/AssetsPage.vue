<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useGridAssetStore } from "../stores/GridAssetStore";
import { AssetHealthStatusText, AssetHealthStatusRank } from "../constants/AssetHealthStatus";
import { HealthSourceText, HEALTH_RULE_NOTE } from "../constants/AssetHealthRule";
import { formatFaultTypes } from "../utils/formatters";
import StatusBadge from "../components/common/StatusBadge.vue";

const store = useGridAssetStore();
onMounted(() => store.load());

// 值班员视角：健康越差、越是故障驱动的资产越往前排。
const rows = computed(() =>
  [...store.rows].sort((a, b) =>
    AssetHealthStatusRank[b.health_status] - AssetHealthStatusRank[a.health_status]
    || Number(b.health_source === "FAULT_DRIVEN") - Number(a.health_source === "FAULT_DRIVEN")
    || b.open_fault_count - a.open_fault_count
  )
);
</script>

<template>
  <section class="panel wide">
    <h2>资产台账</h2>
    <p class="note">{{ HEALTH_RULE_NOTE }}</p>
    <table class="table">
      <thead>
        <tr><th>资产编码</th><th>类型</th><th>所属线路</th><th>安装位置</th><th>建档状态</th><th>当前健康</th><th>判定依据</th><th>未复电故障</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.asset_code }}</td>
          <td>{{ row.asset_type }}</td>
          <td>{{ row.feeder_line }}</td>
          <td>{{ row.location_desc }}</td>
          <td><StatusBadge :value="row.baseline_health_status" :text="AssetHealthStatusText[row.baseline_health_status]" /></td>
          <td><StatusBadge :value="row.health_status" :text="AssetHealthStatusText[row.health_status]" /></td>
          <td>{{ HealthSourceText[row.health_source] }}</td>
          <td>{{ formatFaultTypes(row.open_fault_types) }}<template v-if="row.open_fault_count > 0">（{{ row.open_fault_count }} 起）</template></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
