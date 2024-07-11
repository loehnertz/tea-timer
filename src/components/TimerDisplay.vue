<template>
  <div class="content has-text-centered mt-5">
    <p id="infusion-counter" class="title is-2">
      <span class="has-text-weight-bold">Current Infusion:</span>
      {{ infusionCount }}
    </p>
    <p id="start-time" class="title is-6">
      <span class="has-text-weight-bold">Started at:</span>
      {{ startedAt.toLocaleTimeString(undefined, dateFormatOptions) }}
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
    startedAt: {
      type: Date,
      required: true,
    },
  },
  emits: ['finishInfusion', 'updateTimerRunning'],
  data() {
    return {
      timeRemaining: 0,
      timerRunning: false,
      timerProgressPercent: 0,
      timerProgressBarColor: 'is-primary',
      beepWarningPlayed: false,
      intervalId: null as number | null,
      beepEnd: new Audio('./audio/sonar_high.mp3'),
      beepWarning: new Audio('./audio/sonar_low.mp3'),
      dateFormatOptions: { hour: '2-digit', minute: '2-digit', hour12: false } as const,
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
    timeRemaining: 'updateWindowTitle',
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
      /**
       * Calculates the remaining time based on the start moment and total time.
       *
       * @param startMoment The moment when the timer started as an epoch timestamp.
       * @param totalTime The total time in seconds.
       */
      function getRemainingTime(startMoment: number, totalTime: number): number {
        const currentMoment = Date.now()
        const elapsedTimeInSeconds = (currentMoment - startMoment) / 1000
        const remainingTimeInSeconds = totalTime - elapsedTimeInSeconds
        return Math.max(0, remainingTimeInSeconds)
      }

      this.timerRunning = true
      this.$emit('updateTimerRunning', this.timerRunning)

      this.timeRemaining = this.infusionTime
      const startMoment = Date.now()

      this.intervalId = setInterval(() => {
        this.timeRemaining = getRemainingTime(startMoment, this.infusionTime)

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
      }, 100)
    },
    /**
     * Resets the timer to the initial state.
     */
    resetTimer() {
      clearInterval(this.intervalId as number)
      this.timerRunning = false
      this.$emit('updateTimerRunning', this.timerRunning)
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
     * Handles keydown events to control the timer.
     */
    handleKeydown(event: KeyboardEvent) {
      switch (event.code) {
        case 'Space':
          event.preventDefault()
          this.toggleStartStop()
          break
      }
    },
  },
  mounted() {
    this.updateTimeRemaining()
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    clearInterval(this.intervalId as number)
    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>

<style scoped>
#infusion-counter {
  margin-bottom: 0.5em;
}

#start-time {
  margin-bottom: 2em;
}

#timer {
  font-size: 3.5rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  #timer {
    font-size: 3rem;
  }
}
</style>
