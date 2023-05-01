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
    <span class="multiselect-wrapper">
      <VueMultiselect selectLabel="" deselectLabel="remove" placeholder="Select server" v-model="model.server"
        :options="groupedServers" group-values="servers" group_label="id" :group-select="false" :allow-empty="true"
        :multiple="false" :custom-label="((e: any) => e.name)" track-by="name" label="name">
      </VueMultiselect>
      <button @click="model.server = undefined">X</button>
    </span>

    <span class="multiselect-wrapper">
      <VueMultiselect selectLabel="" deselectLabel="remove" placeholder="Select weapon" v-model="model.weapon"
        :custom-label="((e: any) => weaponLocale[e] || e)" :options="sortedWeaponList" :allow-empty="true">
      </VueMultiselect>
      <button @click="model.weapon = undefined">X</button>
    </span>

    <span class="multiselect-wrapper">
      <VueMultiselect :options-limit="20" selectLabel="" deselectLabel="remove" placeholder="Search player"
        v-model="playerHighlighted" :options="sortedPlayerList" :allow-empty="true"
        :custom-label="((e: Player) => e?.username)"></VueMultiselect>
      <button @click="playerHighlighted = undefined">X</button>
    </span>
  </div>

  <div id="playerView">
    <PlayerList :filters="filters" v-on:highlightPlayer="highlight_player" :playerHighlighted="playerHighlighted?.id">
    </PlayerList>
    <PlayerChart :filters="filters" v-on:highlightPlayer="highlight_player" :playerHighlighted="playerHighlighted?.id">
    </PlayerChart>
    <WeaponChart :filters="{ player: playerHighlighted?.id, ...filters }" :playerHighlighted="playerHighlighted?.id">
    </WeaponChart>
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
import weapons from '../stores/weapons.json'

export default defineComponent({
  name: 'PlayerView',
  components: {
    VueMultiselect, PlayerList, PlayerChart, WeaponChart
  },

  data () {
    return {
      model: { server: undefined, weapon: undefined } as unknown as { weapon: Weapon | Weapon[] | undefined, server: (Server & { name?: string }) | (Server & { name?: string })[] | undefined },
      filters: {} as Filters,
      store: useKillStore(),
      playerHighlighted: undefined as (Player & { id: string }) | undefined,
      weaponLocale: weapons as { [key: string]: string }
    }
  },
  computed: {
    servers (): { [key: string]: Server } {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { server: _, player: _1, ...withoutServer } = this.filters
      const data = this.store.getServerList(withoutServer)?.value.data
      if (!data) return this.store.fetchServers(withoutServer).value.data
      return data
    },
    groupedServers () {
      const hosts = [] as { id: string, servers: (Server & { name?: string })[] }[]
      Object.entries(this.servers).forEach((e) => {
        if (!hosts.find(host => host.id === e[1].host + 'sfdsdfsd')) hosts.push({ id: e[1].host + 'sfdsdfsd', servers: [] as Server[] })
        hosts.find(host => host.id === e[1].host + 'sfdsdfsd')?.servers.push({ name: e[0], ...e[1] })
      })
      return hosts
    },
    weapons (): { [key: string]: Weapon } {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { weapon: _, player: _1, ...withoutWeapons } = this.filters
      const data = this.store.getWeaponList(withoutWeapons)?.value.data
      if (!data) return this.store.fetchWeapons(withoutWeapons).value.data
      return data
    },
    players (): { [key: string]: Player } {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { player: _, ...withoutPlayers } = this.filters
      const data = this.store.getPlayerList(withoutPlayers)?.value.data
      if (!data) return this.store.fetchPlayers(withoutPlayers).value.data
      return data
    },
    sortedWeaponList (): string[] {
      if (!this.weapons) return []
      const weapons = Object.keys(this.weapons)
      return weapons.sort()
    },
    sortedServerList (): string[] {
      if (!this.servers) return []
      const servers = Object.keys(this.servers)
      return servers.sort()
    },
    sortedPlayerList (): Player[] {
      if (!this.players) return []
      const players = Object.entries(this.players).map(e => ({ id: e[0], ...e[1] }))
      return players.sort((a: Player, b: Player) => {
        if (a.username < b.username) {
          return -1
        }
        if (a.username > b.username) {
          return 1
        }
        return 0
      })
    }
  },
  watch: {
    model: {
      handler (newModel) {
        this.filters.server = newModel.server?.name
        this.filters.weapon = newModel.weapon
      },
      deep: true
    }
  },
  methods: {
    highlight_player (playerid: string) {
      const player = this.players[playerid]
      if (player) {
        this.playerHighlighted = { id: playerid, ...player }
        return
      }
      this.playerHighlighted = undefined
    }
  }
})
</script>

<style scoped>
.multiselect {
  margin: 0 .5em 1em .5em;
}
.multiselect-wrapper{
  display: flex;
}
.multiselect-wrapper button{
  margin: 0 0 1em 0;
  font-size: 16px;
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
  .playerChart{
    display:none;
  }
  .weaponChart{
    display:none;
  }
}

#filters {
  grid-area: filters;
}
</style>
