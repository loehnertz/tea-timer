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
          max="100"
          min="-100"
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
  emits: ['updateOffsetTime'],
  data() {
    return {
      positivePercentageAdjustments: [10, 25, 50],
      negativePercentageAdjustments: [10, 25, 50].reverse(),
    }
  },
  methods: {
    /**
     * Adjusts the offset time by a percentage.
     * @param percentage - The percentage to adjust the offset time by.
     */
    adjustOffsetByPercentage(percentage: number) {
      const newOffset = (this.incrementTime * percentage) / 100
      this.$emit('updateOffsetTime', newOffset)
    },
    /**
     * Updates the offset time.
     * @param event - The input event.
     */
    updateOffsetTime(event: Event) {
      const target: HTMLInputElement = event.target as HTMLInputElement
      const offset: number = parseFloat(target.value)
      if (isNaN(offset) || offset < -100 || offset > 100) return
      this.$emit('updateOffsetTime', offset)
    },
    /**
     * Handles keydown events to control the timer.
     */
    handleKeydown(event: KeyboardEvent) {
      switch (event.code) {
        case 'ArrowUp':
          event.preventDefault()
          if (!this.timerRunning) {
            this.$emit('updateOffsetTime', this.offsetTime + 1)
          }
          break
        case 'ArrowDown':
          event.preventDefault()
          if (!this.timerRunning && this.offsetTime > 0) {
            this.$emit('updateOffsetTime', this.offsetTime - 1)
          }
          break
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>

<style scoped>
#offset-buttons {
  justify-content: space-around;
}

#offset-buttons > div {
  display: flex;
  flex-direction: row;
}

#offset-buttons .button {
  font-size: 0.75rem;
  padding: 0.5rem;
  margin: 5px;
}

#offset-buttons .button:first-child {
  margin-left: 0;
}

#offset-buttons .button:last-child {
  margin-right: 0;
}

@media (max-width: 425px) {
  #offset-buttons.buttons {
    justify-content: center;
  }
}
</style>
