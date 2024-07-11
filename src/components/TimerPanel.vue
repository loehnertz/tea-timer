<template>
  <div>
    <h1 class="title is-1 has-text-centered">🍵</h1>
    <TimerDisplay
      ref="timerDisplay"
      :incrementTime="incrementTime"
      :infusionCount="infusionCount"
      :initialTime="initialTime"
      :offsetTime="offsetTime"
      :startedAt="startedAt"
      @finishInfusion="finishInfusion"
      @updateTimerRunning="timerRunning = $event"
    />
    <div class="buttons are-medium is-centered mt-4">
      <button
        :class="timerRunning ? 'is-danger' : 'is-success'"
        class="button is-large"
        @click="toggleStartStop"
      >
        {{ timerRunning ? 'Stop' : 'Start' }}
      </button>
    </div>
    <div class="buttons are-medium mt-4">
      <button class="button is-info" @click="previousInfusion">Previous</button>
      <button class="button is-warning" @click="nextInfusion">Skip</button>
    </div>
    <TimerAdjustment
      :incrementTime="incrementTime"
      :offsetTime="offsetTime"
      :timerRunning="timerRunning"
      @updateOffsetTime="offsetTime = $event"
    />
    <hr />
    <BackToSettings @backToSettings="$emit('backToSettings')" />
    <FooterAttribution />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TimerDisplay from '@/components/TimerDisplay.vue'
import TimerAdjustment from '@/components/TimerAdjustment.vue'
import BackToSettings from '@/components/BackToSettings.vue'
import FooterAttribution from '@/components/FooterAttribution.vue'

export default defineComponent({
  name: 'TimerPanel',
  components: {
    TimerDisplay,
    TimerAdjustment,
    BackToSettings,
    FooterAttribution,
  },
  props: {
    initialTime: {
      type: Number,
      required: true,
    },
    incrementTime: {
      type: Number,
      required: true,
    },
    infusionCount: {
      type: Number,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
  },
  emits: ['changedInfusionCount', 'finishInfusion', 'backToSettings'],
  data() {
    return {
      offsetTime: 0,
      timerRunning: false,
      wakeLockActive: false,
      wakeLock: null as WakeLockSentinel | null,
    }
  },
  watch: {
    /**
     * Watches for changes to the timer running state and requests or releases the wake lock accordingly.
     */
    async timerRunning(isRunning) {
      this.wakeLockActive = isRunning
    },
    async wakeLockActive(isActive) {
      if (isActive) {
        await this.requestWakeLock()
        console.log('Requested screen wake lock')
      } else {
        await this.releaseWakeLock()
        console.log('Screen wake lock released')
      }
    },
  },
  methods: {
    /**
     * Toggle the start/stop state of the timer.
     */
    toggleStartStop() {
      ;(this.$refs.timerDisplay as InstanceType<typeof TimerDisplay>).toggleStartStop()
    },
    /**
     * Move to the next infusion.
     */
    nextInfusion() {
      this.$emit('changedInfusionCount', this.infusionCount + 1)
      this.offsetTime = 0
      ;(this.$refs.timerDisplay as InstanceType<typeof TimerDisplay>).resetTimer()
    },
    /**
     * Move to the previous infusion.
     */
    previousInfusion() {
      if (this.infusionCount > 1) {
        this.$emit('changedInfusionCount', this.infusionCount - 1)
        this.offsetTime = 0
        ;(this.$refs.timerDisplay as InstanceType<typeof TimerDisplay>).resetTimer()
      }
    },
    finishInfusion() {
      this.$emit('finishInfusion', {
        infusionCount: this.infusionCount + 1,
        offsetTime: this.offsetTime,
      })
      this.offsetTime = 0
      ;(this.$refs.timerDisplay as InstanceType<typeof TimerDisplay>).resetTimer()
    },
    /**
     * Requests a wake lock to prevent the screen from sleeping.
     */
    async requestWakeLock() {
      try {
        if (this.wakeLock) return
        this.wakeLock = await navigator.wakeLock.request('screen')
        this.wakeLock.addEventListener('release', () => (this.wakeLockActive = false))
        this.wakeLockActive = true
      } catch (e: any) {
        console.error(`Error requesting wake lock: ${e}`)
      }
    },
    /**
     * Releases the wake lock if it is active to allow the screen to sleep.
     */
    async releaseWakeLock() {
      if (this.wakeLock !== null) {
        await this.wakeLock.release()
        this.wakeLock = null
      }
    },
    /**
     * Handles keydown events to control the timer.
     */
    handleKeydown(event: KeyboardEvent) {
      switch (event.code) {
        case 'ArrowLeft':
          event.preventDefault()
          this.previousInfusion()
          break
        case 'ArrowRight':
          event.preventDefault()
          this.nextInfusion()
          break
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown)
  },
  async beforeUnmount() {
    this.wakeLockActive = false
    document.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>
