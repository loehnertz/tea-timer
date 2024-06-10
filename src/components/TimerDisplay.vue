<template>
  <div class="content has-text-centered mt-5">
    <p class="title is-2">
      Current Infusion: <span class="has-text-weight-bold">{{ infusionCount }}</span>
    </p>
    <p class="title is-1">
      <span id="timer">{{ timeRemaining.toFixed(2) }}</span>
    </p>
    <p class="title is-2">
      <progress
        :class="timerProgressBarColor"
        :value="timerProgressPercent"
        class="progress"
        max="100"
      >
        {{ timerProgressPercent }}%
      </progress>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { clearInterval, setInterval } from 'worker-timers'

export default defineComponent({
  name: 'TimerDisplay',
  props: {
    initialTime: {
      type: Number,
      required: true,
    },
    incrementTime: {
      type: Number,
      required: true,
    },
    offsetTime: {
      type: Number,
      required: true,
    },
    infusionCount: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'finishInfusion',
    'nextInfusion',
    'previousInfusion',
    'updateTimerRunning',
    'updateOffsetTime',
  ],
  data() {
    return {
      timeRemaining: 0,
      timerRunning: false,
      timerProgressPercent: 0,
      timerProgressBarColor: 'is-primary',
      beepWarningPlayed: false,
      intervalId: null as number | null,
      wakeLockActive: false,
      wakeLock: null as WakeLockSentinel | null,
      beepEnd: new Audio('./audio/sonar_high.mp3'),
      beepWarning: new Audio('./audio/sonar_low.mp3'),
    }
  },
  computed: {
    /**
     * Calculates the total time for the current infusion.
     */
    infusionTime() {
      return this.initialTime + this.incrementTime * (this.infusionCount - 1) + this.offsetTime
    },
  },
  watch: {
    initialTime: 'updateTimeRemaining',
    incrementTime: 'updateTimeRemaining',
    offsetTime: 'updateTimeRemaining',
    infusionCount: 'updateTimeRemaining',
    /**
     * Watches for changes to the timer running state and requests or releases the wake lock accordingly.
     */
    async timerRunning(isRunning) {
      if (isRunning) {
        await this.requestWakeLock()
      } else {
        await this.releaseWakeLock()
      }
    },
  },
  methods: {
    /**
     * Updates the time remaining to the total infusion time.
     */
    updateTimeRemaining() {
      this.timeRemaining = this.infusionTime
    },
    /**
     * Updates the window title to display the current time remaining.
     */
    updateWindowTitle() {
      document.title = `${Math.round(this.timeRemaining)} - Tea Timer`
    },
    /**
     * Calculates the percentage of time elapsed based on the current and total time.
     */
    calculateTimeElapsed(currentTime: number, totalTime: number) {
      if (totalTime === 0) {
        console.error('Total time cannot be zero.')
        return 100
      }
      if (currentTime > totalTime) {
        return 100
      }
      return (currentTime / totalTime) * 100
    },
    /**
     * Starts the timer and updates the time remaining every 100ms.
     */
    startTimer() {
      this.timerRunning = true
      this.$emit('updateTimerRunning', this.timerRunning)
      this.timeRemaining = this.infusionTime
      this.intervalId = setInterval(() => {
        this.timeRemaining -= 0.1
        this.timerProgressPercent = this.calculateTimeElapsed(
          this.infusionTime - this.timeRemaining,
          this.infusionTime,
        )
        if (this.timeRemaining <= 5 && !this.beepWarningPlayed) {
          this.beepWarningPlayed = true
          this.timerProgressBarColor = 'is-warning'
          this.beepWarning.play()
        }
        if (this.timeRemaining <= 0) {
          clearInterval(this.intervalId as number)
          this.timerRunning = false
          this.$emit('updateTimerRunning', this.timerRunning)
          this.beepEnd.play()
          this.$emit('finishInfusion')
        }
        this.updateWindowTitle()
      }, 100)
    },
    /**
     * Resets the timer to the initial state.
     */
    resetTimer() {
      this.timerRunning = false
      this.$emit('updateTimerRunning', this.timerRunning)
      clearInterval(this.intervalId as number)
      this.timeRemaining = this.infusionTime
      this.timerProgressPercent = 0
      this.timerProgressBarColor = 'is-primary'
      this.beepWarningPlayed = false
      this.updateWindowTitle()
    },
    /**
     * Toggles the timer between running and stopped states.
     */
    toggleStartStop() {
      if (!this.timerRunning) {
        this.startTimer()
      } else {
        this.resetTimer()
      }
    },
    /**
     * Requests a wake lock to prevent the screen from sleeping.
     */
    async requestWakeLock() {
      if (this.wakeLockActive) return
      try {
        this.wakeLock = await navigator.wakeLock.request('screen')
        this.wakeLock.addEventListener('release', () => {
          this.wakeLockActive = false
        })
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
        case 'Space':
          event.preventDefault()
          this.toggleStartStop()
          break
        case 'ArrowLeft':
          event.preventDefault()
          this.$emit('previousInfusion')
          break
        case 'ArrowRight':
          event.preventDefault()
          this.$emit('nextInfusion')
          break
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
        case 'Backspace':
          event.preventDefault()
          this.$emit('confirmBackToSettings')
          break
      }
    },
  },
  mounted() {
    this.updateTimeRemaining()
    window.addEventListener('keydown', this.handleKeydown)
  },
  async beforeUnmount() {
    clearInterval(this.intervalId as number)
    await this.releaseWakeLock()
    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>
