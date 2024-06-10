<template>
  <div class="container">
    <div class="box">
      <h1 class="title is-1 has-text-centered">🍵<br />Settings</h1>
      <div class="field">
        <label class="label" for="teaType">Select Tea Type:</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select id="teaType" v-model="selectedPresetName">
              <option value="custom">Custom</option>
              <option v-for="preset in presets" :key="preset.name" :value="preset.name">
                {{ preset.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <PresetDetails v-if="selectedPreset" :preset="selectedPreset" />
      <CustomSettings
        v-else
        v-model:incrementTime="incrementTime"
        v-model:initialTime="initialTime"
      />
      <div id="confirm-button" class="field">
        <div class="control">
          <button class="button is-primary is-fullwidth" @click="confirmSettings">Confirm</button>
        </div>
      </div>
      <div id="back-button" class="field mt-3">
        <div class="control">
          <button class="button is-link is-fullwidth" @click="$emit('discardSettings')">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import PresetDetails from '@/components/PresetDetails.vue'
import CustomSettings from '@/components/CustomSettings.vue'
import type { TeaPreset } from '@/assets/types'

export default defineComponent({
  name: 'SettingsPanel',
  components: {
    PresetDetails,
    CustomSettings,
  },
  emits: ['confirmSettings', 'discardSettings'],
  props: {
    presets: {
      type: Array as PropType<TeaPreset[]>,
      required: true,
    },
  },
  data() {
    return {
      selectedPresetName: 'custom' as string,
      initialTime: 20, // Default initial time in seconds
      incrementTime: 5, // Default increment time in seconds
    }
  },
  computed: {
    /**
     * Returns the selected preset object.
     */
    selectedPreset() {
      return this.presets.find((preset) => preset.name === this.selectedPresetName) || null
    },
  },
  methods: {
    /**
     * Emits the `confirmSettings` event to save the selected settings.
     */
    confirmSettings() {
      this.$emit('confirmSettings', {
        initialTime: this.initialTime,
        incrementTime: this.incrementTime,
      })
    },
  },
  watch: {
    /**
     * Updates the initial time and increment time when a new preset is selected.
     * @param newPreset - The newly selected preset.
     */
    selectedPreset(newPreset) {
      if (newPreset) {
        this.initialTime = newPreset.firstInfusion
        this.incrementTime = newPreset.additionalInfusions
      }
    },
  },
})
</script>
