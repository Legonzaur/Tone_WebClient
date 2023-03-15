<template>
  <div class="playerList">
    <select v-on:change="weaponFilter">
        <option>global</option>
        <option v-for="(weaponData, weaponId) in weapons" v-bind:key="weaponId">{{weaponId}}</option>
    </select>
    <div class="player">
      <span>username</span>
      <span>kills</span>
      <span>deaths</span>
      <span>k/d</span>
      <span>max kill distance</span>
      <span>average kill distance</span>
    </div>
    <div class="player" v-for="(playerData, playerId) in players" v-bind:key="playerId">
      <span>{{ playerData.username }}</span>
      <span>{{ playerData.kills }}</span>
      <span>{{ playerData.deaths }}</span>
      <span>{{ Math.round(playerData.kills/playerData.deaths*100)/100 }}</span>
      <span>{{ playerData.max_kill_distance }}</span>
      <span>{{ Math.round(playerData.avg_kill_distance * 100) / 100}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    msg: String
  }
})
export default class HelloWorld extends Vue {
  msg!: string;
  players: any = {}
  weapons: any = {}
  created () {
    this.fetchPlayers({})
    this.fetchWeapons({})
  }

  async fetchPlayers ({ weapon, server }:{weapon?:string, server?:string}) {
    const searchParams:Record<string, string> = {}
    if (weapon) { searchParams.weapon = weapon }
    if (server) { searchParams.server = server }

    const response = await fetch(
      'https://tone.sleepycat.date/v1/client/players?' + new URLSearchParams(searchParams)
    )
    const data = await response.json()
    this.players = data
  }

  async fetchWeapons ({ server }:{server?:string}) {
    const searchParams:Record<string, string> = {}
    if (server) { searchParams.server = server }
    const response = await fetch(
      'https://tone.sleepycat.date/v1/client/weapons?' + new URLSearchParams(searchParams)
    )
    const data = await response.json()
    this.weapons = data
    console.log(data)
  }

  weaponFilter (e:Event) {
    const weapon = (e.target as HTMLInputElement).value
    if (weapon === 'global') {
      return this.fetchPlayers({ })
    }
    this.fetchPlayers({ weapon })
  }
}
</script>

<style scoped>
.player {
  display: grid;
  grid-template-columns: 200px 100px 100px 100px 100px 100px;
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
