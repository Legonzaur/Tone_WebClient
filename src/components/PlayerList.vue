<template>
  <div class="playerList">
    <div class="player">
      <span v-on:click="sortPlayerList('username')">username</span>
      <span v-on:click="sortPlayerList('kills')">kills</span>
      <span v-on:click="sortPlayerList('deaths')">deaths</span>
      <span v-on:click="sortPlayerList('k/d')">k/d</span>
      <span v-on:click="sortPlayerList('max_kill_distance')">max kill distance</span>
      <span v-on:click="sortPlayerList('avg_kill_distance')">average kill distance</span>
    </div>
    <div class="player" v-for="playerId in playerIdList" v-bind:key="playerId">
      <span>{{ players[playerId].username }}</span>
      <span>{{ players[playerId].kills }}</span>
      <span>{{ players[playerId].deaths }}</span>
      <span>{{ Math.round(players[playerId].kills / players[playerId].deaths * 100) / 100 }}</span>
      <span>{{ players[playerId].max_kill_distance }}</span>
      <span>{{ Math.round(players[playerId].avg_kill_distance * 100) / 100 }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Player } from '@/store/index'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    filters: Object
  },
  data () {
    return {
      sortingData: { direction: -1, argument: '' as keyof Player | 'k/d' },
      playerIdList: [] as string[],
      store: useStore()
    }
  },
  computed: {
    players ():{[key:string]:Player} { return this.store.getters.getPlayerList(this.filters) }
  },
  watch: {
    players: {
      handler (newval:{[key:string]:Player}): void {
        if (!newval) return
        this.playerIdList = []
        this.sortingData.direction *= -1
        this.playerIdList = Object.keys(newval)
        this.sortPlayerList(this.sortingData.argument)
      },
      immediate: true
    }
  },
  methods: {
    sortPlayerList (arg: ((keyof Player) | 'k/d')) {
      if (arg === this.sortingData.argument) {
        this.sortingData.direction *= -1
      } else {
        if (arg === 'username') {
          this.sortingData.direction = 1
        }
      }
      this.sortingData.argument = arg

      this.playerIdList.sort((a:string, b:string) => {
        if (!this.players) {
          return 0
        }
        let varA, varB
        if (arg === 'k/d') {
          varA = this.players[a].kills / this.players[a].deaths
          varB = this.players[b].kills / this.players[b].deaths
        } else {
          varA = this.players[a][arg]
          varB = this.players[b][arg]
        }

        if (varA < varB) {
          return -1 * this.sortingData.direction
        }
        if (varA > varB) {
          return 1 * this.sortingData.direction
        }
        return 0
      })
    }
  }

})
</script>

<style scoped>
.player {
  display: grid;
  grid-template-columns: 200px 75px 75px 75px 100px 100px;
  background: lightgray;
  margin: 10px;
  text-align: left;
}

.player span {
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 10px;
}
</style>
