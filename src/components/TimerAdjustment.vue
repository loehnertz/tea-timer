<template>
  <div>
    <div class="field mt-5">
      <label class="label" for="offsetTime">Adjust Current Infusion Time (seconds):</label>
      <div class="control">
        <input
          id="offsetTime"
          :disabled="timerRunning"
          :value="offsetTime"
          class="input"
          type="number"
          @input="updateOffsetTime"
        />
      </div>
    </div>
    <div id="offset-buttons" class="buttons are-small mt-5">
      <div id="negative-offsets">
        <button
          v-for="percentage in negativePercentageAdjustments"
          :key="'decrease-' + percentage"
          :disabled="timerRunning"
          class="button is-danger"
          @click="adjustOffsetByPercentage(-percentage)"
        >
          -{{ percentage }}%
        </button>
      </div>
      <div id="positive-offsets">
        <button
          v-for="percentage in positivePercentageAdjustments"
          :key="'increase-' + percentage"
          :disabled="timerRunning"
          class="button is-success"
          @click="adjustOffsetByPercentage(percentage)"
        >
          +{{ percentage }}%
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TimerAdjustment',
  props: {
    timerRunning: {
      type: Boolean,
      required: true,
    },
    offsetTime: {
      type: Number,
      required: true,
    },
    incrementTime: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      positivePercentageAdjustments: [10, 25, 50],
      negativePercentageAdjustments: [10, 25, 50].reverse(),
    }
  },
  methods: {
    adjustOffsetByPercentage(percentage: number) {
      const newOffset = (this.incrementTime * percentage) / 100
      this.$emit('updateOffsetTime', newOffset)
    },
    updateOffsetTime(event: Event) {
      const target = event.target as HTMLInputElement
      this.$emit('updateOffsetTime', parseFloat(target.value))
    },
  },
})
</script>
