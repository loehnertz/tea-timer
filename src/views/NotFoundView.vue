<template>
  <div class="container columns is-centered">
    <div class="box">
      <h1 class="title is-1 has-text-centered">Page Not Found</h1>
      <p class="content">
        The page you are looking for does not exist. Please check the URL or return to the home
        page.
      </p>
      <hr />
      <div class="field">
        <div class="control">
          <router-link class="button is-link is-fullwidth" to="/">Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFoundView',
})
</script>
