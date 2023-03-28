<template>
  <div id="filters">
    <!-- <input type="number" min="0" v-model="filters.minKills">
    <input type="number" min="0" v-model="filters.minDeaths"> -->
    <!-- <select v-on:change="changeFilter({ server: ($event.target as HTMLInputElement).value })">
      <option></option>
      <option v-for="(serverData) in servers" v-bind:key="serverData.id" :value="serverData.id">{{ serverData.name }}
      </option>
    </select>
    <select v-on:change="changeFilter({ weapon: ($event.target as HTMLInputElement).value })">
      <option></option>
      <option v-for="weaponId in sortedWeaponList" v-bind:key="weaponId" :value="weaponId">{{ weaponId }}</option>
    </select> -->

    <VueMultiselect selectLabel="" deselectLabel="remove" placeholder="Select server" v-model="models.server" :options="servers"
      :allow-empty="true" :custom-label="((e) => e.name)" @select="changeFilter({ server: $event.id })"
      @remove="changeFilter({ server: '' })"></VueMultiselect>

    <VueMultiselect selectLabel="" deselectLabel="remove" placeholder="Select weapon" v-model="models.weapon"
      :options="sortedWeaponList" :allow-empty="true" @select="changeFilter({ weapon: $event })"
      @remove="changeFilter({ weapon: '' })"></VueMultiselect>

    <VueMultiselect selectLabel="" deselectLabel="remove" placeholder="Search player" v-model="playerHighlighted"
      :options="sortedPlayerList" :allow-empty="true" :custom-label="((e) => players[e]?.username)"></VueMultiselect>
  </div>

  <div id="playerView">
    <PlayerList :filters="filters" v-on:highlight-player="playerHighlighted = $event"
      :playerHighlighted="playerHighlighted"></PlayerList>
    <PlayerChart :filters="filters" v-on:highlight-player="playerHighlighted = $event"
      :playerHighlighted="playerHighlighted"></PlayerChart>
  </div>
</template>

<script lang="ts">
import { Store, useStore } from 'vuex'
import { Player, Weapon, Server } from '@/store/index'
import PlayerList from '@/components/PlayerList.vue'
import PlayerChart from '@/components/PlayerChart.vue'
import { defineComponent } from 'vue'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

export default defineComponent({
  name: 'PlayerView',
  components: {
    PlayerList, PlayerChart, VueMultiselect
  },

  data () {
    return {
      models: {},
      filters: { minKills: 100, minDeaths: 100 },
      store: useStore(),
      playerHighlighted: undefined
    } as { filters: { weapon?: string, server?: string }, store: Store<any>, playerHighlighted?: string }
  },
  computed: {
    servers (): Server[] { return this.store.state.servers },
    weapons (): { [key: string]: Weapon } { return this.store.getters.getWeaponList(this.filters) },
    sortedWeaponList (): string[] {
      if (!this.weapons) return []
      const weapons = Object.keys(this.weapons)
      return weapons.sort()
    },
    players (): { [key: string]: Player } { return this.store.getters.getPlayerList(this.filters) },
    sortedPlayerList (): string[] {
      if (!this.players) return []
      const players = Object.keys(this.players)
      return players.sort((a: string, b: string) => {
        if (!this.players) {
          return 0
        }

        if (this.players[a].username < this.players[b].username) {
          return -1
        }
        if (this.players[a].username > this.players[b].username) {
          return 1
        }
        return 0
      })
    }
  },
  watch: {
    test: function (newval) {
      console.log(newval)
    }
  },
  methods: {
    async changeFilter ({ weapon, server }: { weapon?: string, server?: string }) {
      console.log(weapon)
      const filters = JSON.parse(JSON.stringify(this.filters))
      if (weapon !== undefined) filters.weapon = weapon
      if (server !== undefined) filters.server = server
      if (weapon === '') delete filters.weapon
      if (server === '') delete filters.server
      const promises = []
      if (!this.store.getters.getPlayerList(filters)) promises.push(this.store.dispatch('fetchPlayers', filters))
      if (!this.store.getters.getWeaponList(filters)) promises.push(this.store.dispatch('fetchWeapons', filters))
      await Promise.all(promises)
      // Delay the update of filters propery after we fetch the data to the API as changing it will cause subcomponents to reload before data is fetched
      this.filters = filters
    }
  }
})
</script>

<style scoped>
.multiselect {
  margin: 0 .5em 1em .5em;
}

#playerView {
  margin: 0 1rem 1rem 1rem;
  /* height:100%; */
  display: grid;
  overflow: auto;
  grid-template-columns: 50% 50%;
}

@media only screen and (max-width: 922px) {
  #playerView {
    margin: 0 1rem 1rem 1rem;
    /* height:100%; */
    display: grid;
    overflow: auto;
    grid-template-columns: 100%;
    width: calc(100vw - 1em);
    margin: 0 0rem 1rem 1rem;
  }
  .multiselect{
    width: calc(100% - 1em)
  }
}

#filters {
  grid-area: filters;
}
</style>
