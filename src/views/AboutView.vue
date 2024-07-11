<template>
  <div class="container columns is-centered">
    <div class="box">
      <h1 class="title is-1 has-text-centered">🍵 Tea Timer</h1>
      <p class="content">
        A feature-rich progressive web application (PWA) to help you manage your tea sessions. It
        allows you to track the time for each tea infusion, adjust the timer settings, and keep
        track of the current infusion count.
      </p>
      <h2 class="subtitle is-4">Features</h2>
      <ul class="content">
        <li>Responsive design that works well on both desktop and mobile devices.</li>
        <li>PWA support for installation on devices and subsequent offline use.</li>
        <li>Dark mode for low-light environments.</li>
        <li>Supports both Gong Fu Cha and Western-style brewing.</li>
        <li>Remembers when the session was started and how many infusions have been brewed.</li>
        <li>Choose from predefined tea presets.</li>
        <li>Set custom initial infusion time and increment per infusion.</li>
        <li>Timer for each infusion with a countdown and progress bar.</li>
        <li>
          Audio alerts for the end of the infusion and five seconds before the end to get ready to
          pour.
        </li>
        <li>
          Adjust the timer just for the next infusion if the last one was too strong or too weak.
        </li>
        <li>
          Control the timer with the space bar and the arrow keys for a more hands-free experience.
        </li>
        <li>
          Keeps the device awake during an infusion to prevent the timer from disappearing while the
          tea is brewing.
        </li>
        <li>
          Stores and loads settings and infusion count using local storage in case the app is closed
          during a session.
        </li>
      </ul>
      <h2 class="subtitle is-4">Built With</h2>
      <ul class="content">
        <li><a href="https://vuejs.org/" target="_blank">Vue.js</a> - The JS framework used.</li>
        <li><a href="https://bulma.io/" target="_blank">Bulma</a> - The CSS framework used.</li>
        <li><a href="https://vitejs.dev/" target="_blank">Vite</a> - The build tool used.</li>
      </ul>
      <h2 class="subtitle is-4">License</h2>
      <p class="content">
        This project is licensed under the MIT License. See the
        <a href="https://github.com/loehnertz/tea-timer/blob/master/LICENSE" target="_blank"
          >LICENSE</a
        >
        file for details.
      </p>
      <h2 class="subtitle is-4">Acknowledgments</h2>
      <p class="content">
        <a href="https://meileaf.com/" target="_blank">Mei Leaf</a> for the brewing times and being
        a great source of tea and the knowledge around it.
      </p>
      <h2 class="subtitle is-4">More Content</h2>
      <p class="content">
        Also see
        <a
          href="https://loehnertz.notion.site/Tea-1a5d5e05ba1843feab8dd426277e02d9#dad13281c64744a5a5639ff70dafc7c4"
          target="_blank"
          >my other projects</a
        >
        on tea!
      </p>
      <hr />
      <div class="field">
        <div class="control">
          <router-link class="button is-link is-fullwidth" to="/">Back to Home</router-link>
        </div>
      </div>
      <FooterAttribution />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FooterAttribution from '@/components/FooterAttribution.vue'

export default defineComponent({
  name: 'AboutView',
  components: {
    FooterAttribution,
  },
})
</script>

<style scoped>
li {
  list-style: disc;
  margin-left: 1.5em;
}
</style>
