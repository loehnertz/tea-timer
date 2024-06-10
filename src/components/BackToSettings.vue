<template>
  <div class="field mt-5">
    <button class="button is-danger is-fullwidth" @click="$emit('backToSettings')">
      Back to Settings
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BackToSettings',
  emits: ['backToSettings'],
})
</script>
