<template>
  <div id="filters">
    <input type="number" min="0" v-model="filters.minKills">
    <input type="number" min="0" v-model="filters.minDeaths">
    <select v-on:change="changeFilter({ server: ($event.target as HTMLInputElement).value })">
      <option></option>
      <option v-for="(serverData) in servers" v-bind:key="serverData.id" :value="serverData.id">{{ serverData.name }}
      </option>
    </select>
    <select v-on:change="changeFilter({ weapon: ($event.target as HTMLInputElement).value })">
      <option></option>
      <option v-for="weaponId in sortedWeaponList" v-bind:key="weaponId" :value="weaponId">{{ weaponId }}</option>
    </select>
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

export default defineComponent({
  name: 'PlayerView',
  components: {
    PlayerList, PlayerChart
  },

  data () {
    return {
      filters: { minKills: 100, minDeaths: 100 },
      store: useStore(),
      playerHighlighted: undefined
    } as { filters: { weapon?: string, server?: string }, store: Store<any>, playerHighlighted?: string }
  },
  computed: {
    servers (): Server[] { return this.store.state.servers },
    weapons (): { [key: string]: Weapon } { return this.store.getters.getWeaponList(this.filters) },
    sortedWeaponList (): string[] {
      const weapons = Object.keys(this.weapons)
      return weapons.sort()
    }
  },
  methods: {
    async changeFilter ({ weapon, server }: { weapon?: string, server?: string }) {
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
#playerView {
  margin: 0 1rem 1rem 1rem;
  /* height:100%; */
  display: grid;
  overflow: auto;
  grid-template-columns: 50% 50%;
}

#filters {
  grid-area: filters;
}
</style>
