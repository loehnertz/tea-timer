<template>
  <RouterView />
</template>

<script lang="ts">
import { RouterView } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TeaTimer',
  components: {
    RouterView,
  },
})
</script>
