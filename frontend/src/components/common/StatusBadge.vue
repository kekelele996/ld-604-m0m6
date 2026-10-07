<script setup lang="ts">
import { computed } from "vue";
import { AssetHealthStatusRank } from "../../constants/AssetHealthStatus";

const props = defineProps<{ value: string; text?: string }>();

// 健康等级和工单终态有固定配色，其余值走中性色。
const tone = computed(() => {
  if (props.value in AssetHealthStatusRank) return ["ok", "watch", "warn", "danger"][AssetHealthStatusRank[props.value as keyof typeof AssetHealthStatusRank]];
  if (props.value === "RESTORED" || props.value === "CLOSED") return "ok";
  if (props.value === "REPAIRING" || props.value === "ARRIVED") return "warn";
  return "neutral";
});
const label = computed(() => props.text ?? props.value.replace(/_/g, " "));
</script>

<template><span class="badge" :class="`badge--${tone}`">{{ label }}</span></template>
