<template>
  <select v-model="filters.server" v-on:change="fetchPlayers(filters)">
    <option></option>
    <option v-for="(serverData, serverId) in servers" v-bind:key="serverId" :value="serverId">{{ serverData.name }}</option>
  </select>
  <select v-model="filters.weapon" v-on:change="fetchPlayers(filters)">
    <option></option>
    <option v-for="(weaponData, weaponId) in weapons" v-bind:key="weaponId" :value="weaponId">{{ weaponId }}</option>
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
  servers: any = {}
  filters: any = {}
  created () {
    this.fetchPlayers({})
    this.fetchWeapons({})
    this.fetchServers()
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

  async fetchServers () {
    const response = await fetch(
      'https://tone.sleepycat.date/v1/client/servers'
    )
    const data = await response.json()
    this.servers = data
    console.log(this.servers)
  }

  data () {
    return { a: 1 }
  }

  async fetchPlayers ({ weapon, server }: { weapon?: string, server?: string }) {
    const searchParams: Record<string, string> = {}
    if (weapon?.toString()) { searchParams.weapon = weapon }
    if (server?.toString()) { searchParams.server = server }
    console.log(server, weapon)
    console.log('https://tone.sleepycat.date/v1/client/players?' + new URLSearchParams(searchParams))
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
