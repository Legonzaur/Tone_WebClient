<template>
    <div id="playerInfo">{{playerWeapons}}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Player, Weapon } from '@/store/index'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    filters: Object,
    playerHighlighted: String
  },
  emits: ['highlightPlayer'],
  data () {
    return {
      sortingData: { direction: -1, argument: 'kills' as keyof Player | 'k/d' },
      store: useStore()
    }
  },
  computed: {
    players (): { [key: string]: Player } { return this.store.getters.getPlayerList(this.filters) },
    player ():Player | undefined {
      if (!this.playerHighlighted) return
      if (!this.players) return
      return this.players[this.playerHighlighted]
    },
    playerWeapons (): { [key: string]: Weapon } {
      return this.store.getters.getWeaponList({ player: this.playerHighlighted, ...this.filters })
    }
  },
  watch: {
  },
  methods: {

  }

})
</script>

<style scoped>
#playerInfo{
    grid-area: info;
}
</style>
