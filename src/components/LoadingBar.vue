<template>
    <div class="loadingComponent">
        <progress class="loadingBar" max="1" :value="value"></progress>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: Number
  }
})
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loadingComponent {
    display:flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 3em);
}
</style>
