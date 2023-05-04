<template>
    <div >
        test
    </div>
  </template>

<script lang="ts">
import { defineComponent, PropType, Ref, toRaw, unref } from 'vue'

export default defineComponent({
  components: { },
  props: {
  },
  emits: ['highlightPlayer'],
  data () {
    return { test: 1 }
  }

})
</script>

  <style scoped>
</style>
