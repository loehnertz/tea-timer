<template>
  <div>
    <div class="field">
      <label class="label is-size-6" for="initialTime">Initial Infusion Time (seconds):</label>
      <div class="control">
        <input
          id="initialTime"
          :value="initialTime"
          class="input"
          min="1"
          type="number"
          @change="updateInitialTime"
        />
      </div>
    </div>
    <div class="field">
      <label class="label is-size-6" for="incrementTime">
        Time Increment per Infusion (seconds):
      </label>
      <div class="control">
        <input
          id="incrementTime"
          :value="incrementTime"
          class="input"
          min="1"
          type="number"
          @change="updateIncrementTime"
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
    initialTime: {
      type: Number,
      required: true,
    },
    incrementTime: {
      type: Number,
      required: true,
    },
  },
  emits: ['updateInitialTime', 'updateIncrementTime'],
  methods: {
    updateInitialTime(event: Event) {
      const target = event.target as HTMLInputElement
      this.$emit('updateInitialTime', parseInt(target.value, 10))
    },
    updateIncrementTime(event: Event) {
      const target = event.target as HTMLInputElement
      this.$emit('updateIncrementTime', parseInt(target.value, 10))
    },
  },
})
</script>
