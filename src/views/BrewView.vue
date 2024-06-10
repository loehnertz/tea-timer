<template>
  <div class="container">
    <div class="box">
      <SettingsPanel
        v-if="showSettings"
        :customDefaults="customDefaults"
        :presets="presets"
        @confirmSettings="confirmSettings"
        @discardSettings="discardSettings"
      />
      <TimerPanel
        v-else
        :incrementTime="incrementTime"
        :infusionCount="infusionCount"
        :initialTime="initialTime"
        @backToSettings="backToSettings"
        @changedInfusionCount="updateInfusionCount"
        @finishInfusion="finishInfusion"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import TimerPanel from '@/components/TimerPanel.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import BackToSettings from '@/components/BackToSettings.vue'
import FooterAttribution from '@/components/FooterAttribution.vue'
import type { Settings, TeaPreset } from '@/assets/types'
import { BrewMethod } from '@/assets/types'

export default defineComponent({
  name: 'BrewView',
  components: {
    SettingsPanel,
    TimerPanel,
    BackToSettings,
    FooterAttribution,
  },
  props: {
    method: {
      type: String as PropType<BrewMethod>,
      required: true,
    },
    customDefaults: {
      type: Object as PropType<{ initialTime: number; incrementTime: number }>,
      required: true,
    },
    presets: {
      type: Array as PropType<TeaPreset[]>,
      required: true,
    },
  },
  data() {
    return {
      initialTime: this.customDefaults.initialTime,
      incrementTime: this.customDefaults.incrementTime,
      infusionCount: 1,
      timerRunning: false,
      showSettings: false,
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
      this.infusionCount = 1
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
     * Finish the current infusion and move to the next.
     */
    finishInfusion(event: { infusionCount: number; offsetTime: number }) {
      console.log(`Enjoy your tea: ${this.getRandomTeaProverb()}`)
      this.initialTime += event.offsetTime
      this.infusionCount = event.infusionCount
      this.persistSettings()
    },
    /**
     * Discard settings and return to the home page if the user confirms.
     */
    backToSettings() {
      if (confirm('Are you sure you want to go back to settings and discard the session?')) {
        localStorage.removeItem('settings')
        document.title = 'Tea Timer'
        this.showSettings = true
      }
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
        method: this.method,
      }
      localStorage.setItem('settings', JSON.stringify(settings))
    },
    /**
     * Update the infusion count.
     */
    updateInfusionCount(infusionCount: number) {
      this.infusionCount = infusionCount
      this.persistSettings()
    },
    /**
     * Get a random Chinese tea proverb.
     */
    getRandomTeaProverb() {
      const index = Math.floor(Math.random() * this.chineseTeaProverbs.length)
      return this.chineseTeaProverbs[index]
    },
    /**
     * Handles keydown events to control the timer.
     */
    handleKeydown(event: KeyboardEvent) {
      switch (event.code) {
        case 'Escape':
          event.preventDefault()
          this.backToSettings()
          break
      }
    },
  },
  mounted() {
    this.loadSettings()
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>

<style scoped>
.box {
  text-align: center;
}
</style>
