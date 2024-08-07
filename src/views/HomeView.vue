<template>
  <div class="container columns is-centered">
    <div class="box has-text-centered">
      <h1 class="title is-1">🍵 Tea Timer</h1>
      <p class="content">
        <strong>
          Welcome to <a href="https://tea-timer.com/">tea-timer.com</a>, a feature-rich progressive
          web application (PWA) to help you manage your tea sessions.
        </strong>
        <br />
        <br />
        Track the time for each tea infusion with an alarm, adjust the timer settings, and keep
        track of the current infusion count even when you close the application. You can optionally
        install it on your device for offline use and a more native experience.
      </p>
      <br />
      <h2 class="title is-2">Select Brewing Style</h2>
      <div class="buttons are-medium is-centered mt-4">
        <button class="button is-primary is-large" @click="selectGongFu">Gong Fu Brew</button>
        <button class="button is-primary is-large" @click="selectWestern">Western Brew</button>
      </div>
      <p class="content">
        <strong>Gong Fu Cha (功夫茶)</strong> is a traditional Chinese tea brewing method that uses
        a high leaf-to-water ratio and short steeping times to extract the best and most nuanced
        flavors from the tea leaves. This method allows you to enjoy the tea in many infusions, each
        revealing different aspects of the tea's flavor profile over time.
        <br />
        Watch
        <a href="https://www.youtube.com/watch?v=rPJtA1PQkPU" target="_blank">this video</a> to
        learn more about how to do it.
      </p>
      <p class="content">
        <strong>Western brewing</strong> is the standard method in the West that uses a lower
        leaf-to-water ratio and longer steeping times. This method is more straightforward and
        results in a lot less infusions which extract the tea's flavors at the same time.
      </p>
      <hr />
      <div class="field mt-3">
        <div class="control">
          <h3>
            <router-link class="button is-link is-fullwidth" to="/about">About</router-link>
          </h3>
        </div>
      </div>
      <FooterAttribution />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FooterAttribution from '@/components/FooterAttribution.vue'
import { BrewMethod, type SessionSettings } from '@/assets/types'
import { isOlderThan12hours } from '@/shared'

export default defineComponent({
  name: 'HomeView',
  components: {
    FooterAttribution,
  },
  methods: {
    selectGongFu() {
      this.$router.push('/gong-fu-brew')
    },
    selectWestern() {
      this.$router.push('/western-brew')
    },
    loadSettings() {
      const storedSettings = localStorage.getItem('settings')

      if (storedSettings) {
        const settings: SessionSettings = JSON.parse(storedSettings)

        if (isOlderThan12hours(settings.savedAt)) {
          console.log('Settings are outdated; discarding them')
          localStorage.removeItem('settings')
          return
        }

        switch (settings.method) {
          case BrewMethod.GONG_FU:
            this.selectGongFu()
            break
          case BrewMethod.WESTERN:
            this.selectWestern()
            break
          default:
            console.warn('Unknown brewing method:', settings.method)
            break
        }
      }
    },
  },
  mounted() {
    this.loadSettings()
  },
})
</script>
