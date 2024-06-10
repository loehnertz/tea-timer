<template>
  <div>
    <div class="field">
      <label class="label is-size-6"> Water Temperature: {{ preset.waterTemp }} °C </label>
    </div>
    <div class="field">
      <label class="label is-size-6"> Amount: {{ preset.amount }} g / 100 ml </label>
    </div>
    <div class="field">
      <label class="label is-size-6 has-text-weight-bold">
        1st Infusion Time: {{ preset.firstInfusion }} seconds
      </label>
    </div>
    <div class="field">
      <label class="label is-size-6 has-text-weight-bold">
        Additional Infusion Time: {{ preset.additionalInfusions }} seconds
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
