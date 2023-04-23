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

    <VueMultiselect selectLabel="" deselectLabel="remove" placeholder="Select server" v-model="filters.server"
      :options="sortedServerList" :allow-empty="true" :custom-label="((e:Server) => e)"
      ></VueMultiselect>

    <VueMultiselect selectLabel="" deselectLabel="remove" placeholder="Select weapon" v-model="filters.weapon"
      :options="sortedWeaponList" :allow-empty="true"
      ></VueMultiselect>

    <VueMultiselect selectLabel="" deselectLabel="remove" placeholder="Search player" v-model="playerHighlighted"
      :options="sortedPlayerList" :allow-empty="true" :custom-label="((e:string) => players[e]?.username)"></VueMultiselect>
  </div>

  <div id="playerView">
    <PlayerList :filters="filters" v-on:highlight-player="playerHighlighted = $event"
      :playerHighlighted="playerHighlighted"></PlayerList>
    <PlayerChart :filters="filters" v-on:highlight-player="playerHighlighted = $event"
      :playerHighlighted="playerHighlighted"></PlayerChart>
    <WeaponChart :filters="{player: playerHighlighted, ...filters}" :playerHighlighted="playerHighlighted"></WeaponChart>
  </div>
</template>

<script lang="ts">
import { Player, Weapon, Server, useKillStore, Filters } from '@/stores/kill'
import PlayerList from '@/components/PlayerList.vue'
import PlayerChart from '@/components/PlayerChart.vue'
import WeaponChart from '@/components/WeaponChart.vue'
import { defineComponent } from 'vue'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

export default defineComponent({
  name: 'PlayerView',
  components: {
    VueMultiselect, PlayerList, PlayerChart, WeaponChart
  },

  data () {
    return {
      filters: {} as Filters,
      store: useKillStore(),
      playerHighlighted: undefined
    }
  },
  computed: {
    servers (): { [key: string]: Server } {
      const { server: _, player: _1, ...withoutServer } = this.filters
      const data = this.store.getServerList(withoutServer)?.data
      if (!data) {
        this.store.fetchServers(withoutServer)
        return {}
      }
      return data
    },
    weapons (): { [key: string]: Weapon } {
      const { weapon: _, player: _1, ...withoutWeapons } = this.filters
      const data = this.store.getWeaponList(withoutWeapons)?.data
      if (!data) {
        this.store.fetchWeapons(withoutWeapons)
        return {}
      }
      return data
    },
    players (): { [key: string]: Player } {
      const { player: _, ...withoutPlayers } = this.filters
      const data = this.store.getPlayerList(withoutPlayers)?.data
      if (!data) {
        this.store.fetchPlayers(withoutPlayers)
        return {}
      }
      return data
    },
    sortedWeaponList (): string[] {
      if (!this.weapons) return []
      const weapons = Object.keys(this.weapons)
      return weapons.sort()
    },
    sortedServerList ():string[] {
      if (!this.servers) return []
      const servers = Object.keys(this.servers)
      return servers.sort()
    },
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
  grid-template-areas:
    'list chart'
    'list info';
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
}

@media only screen and (max-width: 922px) {
  #playerView {
    margin: 0 1rem 1rem 1rem;
    /* height:100%; */
    display: grid;
    overflow: auto;
    grid-template-areas:
    'list list';
    grid-template-columns: 100%;
    grid-template-rows: 100%;
    width: calc(100vw - 1em);
    margin: 0 0rem 1rem 1rem;
  }

  .multiselect {
    width: calc(100% - 1em)
  }
}

#filters {
  grid-area: filters;
}
</style>
