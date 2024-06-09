<template>
  <div>
    <div class="field">
      <label class="label" for="initialTime">Initial Infusion Time (seconds):</label>
      <div class="control">
        <input id="initialTime" v-model.number="initialTime" class="input" min="1" type="number" />
      </div>
    </div>
    <div class="field">
      <label class="label" for="incrementTime">Time Increment per Infusion (seconds):</label>
      <div class="control">
        <input
          id="incrementTime"
          v-model.number="incrementTime"
          class="input"
          min="1"
          type="number"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomSettings',
  props: {
    initialTime: Number,
    incrementTime: Number,
  },
})
</script>
