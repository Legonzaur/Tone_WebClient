<template>
  <div id="playerInfo">
    <div v-if="playerWeapons && sortedWeaponList">
      <span>Most Used Weapons :</span><br/>
      <div v-if="sortedWeaponList[0]">{{ `${sortedWeaponList[0]} : ${playerWeapons[sortedWeaponList[0]].kills} kills` }}</div>
      <div v-if="sortedWeaponList[1]">{{ `${sortedWeaponList[1]} : ${playerWeapons[sortedWeaponList[1]].kills} kills` }}</div>
      <div v-if="sortedWeaponList[2]">{{ `${sortedWeaponList[2]} : ${playerWeapons[sortedWeaponList[2]].kills} kills` }}</div>
      <div v-if="sortedWeaponList[3]">{{ `${sortedWeaponList[3]} : ${playerWeapons[sortedWeaponList[3]].kills} kills` }}</div>
      <div v-if="sortedWeaponList[4]">{{ `${sortedWeaponList[4]} : ${playerWeapons[sortedWeaponList[4]].kills} kills` }}</div>
    </div>

  </div>
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
    player (): Player | undefined {
      if (!this.playerHighlighted) return
      if (!this.players) return
      return this.players[this.playerHighlighted]
    },
    playerWeapons (): { [key: string]: Weapon } {
      return this.store.getters.getWeaponList({ player: this.playerHighlighted, ...this.filters })
    },
    sortedWeaponList (): string[] {
      if (!this.playerWeapons) return []
      const weapons = Object.keys(this.playerWeapons)
      weapons.sort((a, b) => {
        if (Number(this.playerWeapons[a].kills) < Number(this.playerWeapons[b].kills)) {
          return 1
        }
        if (Number(this.playerWeapons[a].kills) > Number(this.playerWeapons[b].kills)) {
          return -1
        }
        return 0
      })
      console.log(weapons)
      return weapons
    }
  },
  watch: {
  },
  methods: {

  }

})
</script>

<style scoped>
#playerInfo {
  grid-area: info;
}

@media only screen and (max-width: 922px) {
  #playerInfo {
    display: none
  }
}
</style>
