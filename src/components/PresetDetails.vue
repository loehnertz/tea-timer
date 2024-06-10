<template>
  <div>
    <div class="field">
      <label class="label">Water Temperature: {{ preset.waterTemp }} °C</label>
    </div>
    <div class="field">
      <label class="label">Amount: {{ preset.amount }} g / 100 ml</label>
    </div>
    <div class="field">
      <label class="label">
        <span class="has-text-weight-bold"
          >1st Infusion Time: {{ preset.firstInfusion }} seconds</span
        >
      </label>
    </div>
    <div class="field">
      <label class="label">
        <span class="has-text-weight-bold"
          >Additional Infusion Time: {{ preset.additionalInfusions }} seconds</span
        >
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { TeaPreset } from '@/assets/types'

export default defineComponent({
  name: 'PresetDetails',
  props: {
    preset: {
      type: Object as PropType<TeaPreset>,
      required: true,
    },
  },
})
</script>
