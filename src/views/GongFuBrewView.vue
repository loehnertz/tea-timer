<template>
  <div>
    <SettingsPanel
      v-if="showSettings"
      :presets="presets"
      @confirmSettings="loadSettings"
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
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      const storedSettings = localStorage.getItem('settings')
      if (storedSettings) {
        const settings: Settings = JSON.parse(storedSettings)
        if (settings.initialTime !== undefined && settings.incrementTime !== undefined) {
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
    toggleStartStop() {
      this.$refs.timerDisplay.toggleStartStop()
    },
    nextInfusion() {
      this.initialTime += this.offsetTime
      this.infusionCount++
      this.offsetTime = 0
      this.persistSettings()
      this.$refs.timerDisplay.resetTimer()
    },
    previousInfusion() {
      if (this.infusionCount > 1) {
        this.infusionCount--
        this.persistSettings()
        this.$refs.timerDisplay.resetTimer()
      }
    },
    finishInfusion() {
      this.nextInfusion()
      console.log(`Enjoy your tea: ${this.getRandomTeaProverb()}`)
    },
    confirmBackToSettings() {
      if (confirm('Are you sure you want to discard the current session and return to settings?')) {
        this.backToSettings()
      }
    },
    backToSettings() {
      localStorage.removeItem('settings')
      document.title = 'Tea Timer'
      this.offsetTime = 0
      this.showSettings = true
    },
    discardSettings() {
      localStorage.removeItem('settings')
      this.$router.push('/')
    },
    persistSettings() {
      const settings: Settings = {
        initialTime: this.initialTime,
        incrementTime: this.incrementTime,
        infusionCount: this.infusionCount,
        method: BrewMethod.GONG_FU,
      }
      localStorage.setItem('settings', JSON.stringify(settings))
    },
    updateInfusionCount(newCount: number) {
      this.infusionCount = newCount
      this.persistSettings()
    },
    updateOffsetTime(newOffset: number) {
      this.offsetTime = newOffset
    },
    updateTimerRunning(running: boolean) {
      this.timerRunning = running
    },
    getRandomTeaProverb() {
      const chineseTeaProverbs = [
        '一日无茶苦，长年无茶老。 (A day without tea is bitter; a lifetime without tea is unbearable.)',
        '茶余酒后事。 (Talks over tea can continue even after the wine is finished.)',
        "茶不饮不知味。 (You won't know the real taste of tea until you drink it.)",
        '茶香以静制。 (The fragrance of tea is best appreciated in tranquility.)',
        '水为茶之母。 (Water is the mother of tea.)',
      ]
      const index = Math.floor(Math.random() * chineseTeaProverbs.length)
      return chineseTeaProverbs[index]
    },
  },
})
</script>
