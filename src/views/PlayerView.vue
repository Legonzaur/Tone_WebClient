<template>
  <PlayerList></PlayerList>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PlayerList from '@/components/PlayerList.vue'

@Options({
  components: {
    PlayerList
  }
})
export default class PlayerView extends Vue {
  mounted = function () {
    console.log('q')
  };

  data () {
    return { a: 1 }
  }
}
</script>
