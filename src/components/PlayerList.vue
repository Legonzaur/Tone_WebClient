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
      <span>{{ $props.players[playerId].username }}</span>
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

export default defineComponent({
  props: {
    players: Object
  },
  data () {
    return {
      sortingData: { direction: -1, argument: '' },
      playerIdList: [] as string[]
    }
  },
  watch: {
    players: function (newval: any, oldval: any): void {
      this.playerIdList = []
      this.sortingData.direction *= -1
      this.playerIdList = Object.keys(newval)
      this.sortPlayerList(this.sortingData.argument)
    }
  },
  methods: {
    sortPlayerList (arg: string) {
      if (arg === this.sortingData.argument) {
        this.sortingData.direction *= -1
      } else {
        if (arg === 'username') {
          this.sortingData.direction = 1
        }
      }
      this.sortingData.argument = arg

      this.playerIdList.sort((a:any, b:any) => {
        if (!this.$props.players) {
          return 0
        }
        let varA = this.$props.players[a][arg]
        let varB = this.$props.players[b][arg]
        if (arg === 'k/d') {
          varA = this.$props.players[a].kills / this.$props.players[a].deaths
          varB = this.$props.players[b].kills / this.$props.players[b].deaths
        }

        if (varA < varB) {
          return -1 * this.sortingData.direction
        }
        if (varA > varB) {
          return 1 * this.sortingData.direction
        }
        // names must be equal
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
