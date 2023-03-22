<template>
  <select v-on:change="weaponFilter">
    <option>global</option>
    <option v-for="(weaponData, weaponId) in weapons" v-bind:key="weaponId">{{ weaponId }}</option>
  </select>
  <div class="playersData">

    <PlayerList :players="players"></PlayerList>
    <PlayerChart :players="players"></PlayerChart>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PlayerList from '@/components/PlayerList.vue'
import PlayerChart from '@/components/PlayerChart.vue'

@Options({
  components: {
    PlayerList, PlayerChart
  }
})
export default class PlayerView extends Vue {
  players: any = {}
  weapons: any = {}
  created () {
    this.fetchPlayers({})
    this.fetchWeapons({})
  }

  async fetchWeapons ({ server }: { server?: string }) {
    const searchParams: Record<string, string> = {}
    if (server) { searchParams.server = server }
    const response = await fetch(
      'https://tone.sleepycat.date/v1/client/weapons?' + new URLSearchParams(searchParams)
    )
    const data = await response.json()
    this.weapons = data
  }

  data () {
    return { a: 1 }
  }

  weaponFilter (e: Event) {
    const weapon = (e.target as HTMLInputElement).value
    if (weapon === 'global') {
      return this.fetchPlayers({})
    }
    this.fetchPlayers({ weapon })
  }

  async fetchPlayers ({ weapon, server }: { weapon?: string, server?: string }) {
    const searchParams: Record<string, string> = {}
    if (weapon) { searchParams.weapon = weapon }
    if (server) { searchParams.server = server }

    const response = await fetch(
      'https://tone.sleepycat.date/v1/client/players?' + new URLSearchParams(searchParams)
    )
    const data = await response.json()
    Object.keys(data).forEach(e => {
      data[e].kills = Number(data[e].kills)
      data[e].deaths = Number(data[e].deaths)
      data[e].max_kill_distance = Number(data[e].max_kill_distance)
      data[e].avg_kill_distance = Number(data[e].avg_kill_distance)
    })
    this.players = data
  }
}
</script>

<style scoped>
.playersData {
  display: grid;
  grid-template-columns: 50% 50%;
}
</style>
