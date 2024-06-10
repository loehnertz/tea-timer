<template>
  <div>
    <SettingsPanel
      v-if="showSettings"
      :presets="presets"
      @confirmSettings="confirmSettings"
      @discardSettings="discardSettings"
    />
    <div v-else id="timer-box" class="box">
      <h1 class="title is-1 has-text-centered">🍵</h1>
      <TimerDisplay
        ref="timerDisplay"
        :incrementTime="incrementTime"
        :infusionCount="infusionCount"
        :initialTime="initialTime"
        :offsetTime="offsetTime"
        @finishInfusion="finishInfusion"
        @nextInfusion="nextInfusion"
        @previousInfusion="previousInfusion"
        @updateInfusionCount="updateInfusionCount"
        @updateTimerRunning="updateTimerRunning"
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
        @updateOffsetTime="updateOffsetTime"
      />
      <hr />
      <BackToSettings @backToSettings="confirmBackToSettings" />
      <FooterAttribution />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TimerDisplay from '@/components/TimerDisplay.vue'
import TimerAdjustment from '@/components/TimerAdjustment.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import BackToSettings from '@/components/BackToSettings.vue'
import FooterAttribution from '@/components/FooterAttribution.vue'
import type { Settings, TeaPreset } from '@/assets/types'
import { BrewMethod } from '@/assets/types'
import { gongFuPresets } from '@/assets/presets'

export default defineComponent({
  name: 'GongFuView',
  components: {
    TimerDisplay,
    TimerAdjustment,
    SettingsPanel,
    BackToSettings,
    FooterAttribution,
  },
  data() {
    return {
      infusionCount: 1,
      initialTime: 20, // Default initial time in seconds
      incrementTime: 5, // Default increment time in seconds
      offsetTime: 0,
      timerRunning: false,
      showSettings: false,
      presets: gongFuPresets as TeaPreset[],
      chineseTeaProverbs: [
        '一日无茶苦，长年无茶老。 (A day without tea is bitter; a lifetime without tea is unbearable.)',
        '茶余酒后事。 (Talks over tea can continue even after the wine is finished.)',
        "茶不饮不知味。 (You won't know the real taste of tea until you drink it.)",
        '茶香以静制。 (The fragrance of tea is best appreciated in tranquility.)',
        '水为茶之母。 (Water is the mother of tea.)',
      ],
    }
  },
  methods: {
    /**
     * Confirm the settings and save them to local storage.
     */
    confirmSettings(event: { initialTime: number; incrementTime: number }) {
      this.initialTime = event.initialTime
      this.incrementTime = event.incrementTime
      this.persistSettings()
      this.showSettings = false
    },
    /**
     * Load the settings from local storage.
     */
    loadSettings() {
      const storedSettings = localStorage.getItem('settings')
      if (storedSettings) {
        const settings: Settings = JSON.parse(storedSettings)
        if (settings.initialTime != undefined && settings.incrementTime != undefined) {
          this.initialTime = settings.initialTime
          this.incrementTime = settings.incrementTime
          this.infusionCount = settings.infusionCount || 1
          this.showSettings = false
        } else {
          this.showSettings = true
        }
      } else {
        this.showSettings = true
      }
    },
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
      this.infusionCount++
      this.offsetTime = 0
      this.persistSettings()
      ;(this.$refs.timerDisplay as InstanceType<typeof TimerDisplay>).resetTimer()
    },
    /**
     * Move to the previous infusion.
     */
    previousInfusion() {
      if (this.infusionCount > 1) {
        this.infusionCount--
        this.offsetTime = 0
        this.persistSettings()
        ;(this.$refs.timerDisplay as InstanceType<typeof TimerDisplay>).resetTimer()
      }
    },
    /**
     * Finish the current infusion and move to the next.
     */
    finishInfusion() {
      console.log(`Enjoy your tea: ${this.getRandomTeaProverb()}`)
      this.initialTime += this.offsetTime
      this.nextInfusion()
    },
    /**
     * Confirm returning to settings.
     */
    confirmBackToSettings() {
      if (confirm('Are you sure you want to discard the current session and return to settings?')) {
        this.backToSettings()
      }
    },
    /**
     * Discard settings and return to the home page.
     */
    backToSettings() {
      localStorage.removeItem('settings')
      document.title = 'Tea Timer'
      this.offsetTime = 0
      this.showSettings = true
    },
    /**
     * Discard settings and return to the home page.
     */
    discardSettings() {
      localStorage.removeItem('settings')
      this.$router.push('/')
    },
    /**
     * Persist the current settings to local storage.
     */
    persistSettings() {
      const settings: Settings = {
        initialTime: this.initialTime,
        incrementTime: this.incrementTime,
        infusionCount: this.infusionCount,
        method: BrewMethod.GONG_FU,
      }
      localStorage.setItem('settings', JSON.stringify(settings))
    },
    /**
     * Update the infusion count.
     */
    updateInfusionCount(newCount: number) {
      this.infusionCount = newCount
      this.persistSettings()
    },
    /**
     * Update the offset time.
     */
    updateOffsetTime(newOffset: number) {
      this.offsetTime = newOffset
    },
    /**
     * Update the timer running state.
     */
    updateTimerRunning(running: boolean) {
      this.timerRunning = running
    },
    /**
     * Get a random Chinese tea proverb.
     */
    getRandomTeaProverb() {
      const index = Math.floor(Math.random() * this.chineseTeaProverbs.length)
      return this.chineseTeaProverbs[index]
    },
  },
  mounted() {
    this.loadSettings()
  },
})
</script>
