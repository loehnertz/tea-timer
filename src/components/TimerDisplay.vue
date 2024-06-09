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
    }
  },
  computed: {
    infusionTime() {
      return this.initialTime + this.incrementTime * (this.infusionCount - 1) + this.offsetTime
    },
  },
  watch: {
    initialTime: 'updateTimeRemaining',
    incrementTime: 'updateTimeRemaining',
    offsetTime: 'updateTimeRemaining',
    infusionCount: 'updateTimeRemaining',
  },
  methods: {
    updateTimeRemaining() {
      this.timeRemaining = this.infusionTime
    },
    updateWindowTitle() {
      document.title = `${Math.round(this.timeRemaining)} - Tea Timer`
    },
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
    toggleStartStop() {
      if (!this.timerRunning) {
        this.startTimer()
      } else {
        this.resetTimer()
      }
    },
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
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
    clearInterval(this.intervalId as number)
  },
})
</script>
