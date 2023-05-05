<template>
  <div id="filters">
    <span class="multiselect-wrapper">
      <VueMultiselect
        selectLabel=""
        deselectLabel="remove"
        placeholder="Select server"
        v-model="model.server"
        :options="sortedServerList"
        :allow-empty="true"
      >
      </VueMultiselect>
      <button @click="model.server = undefined" :disabled="!model.server">X</button>
    </span>

    <span class="multiselect-wrapper">
      <VueMultiselect
        selectLabel=""
        deselectLabel="remove"
        placeholder="Select weapon"
        v-model="model.weapon"
        :custom-label="((e: any) => weaponLocale[e] || e)"
        :options="sortedWeaponList"
        :allow-empty="true"
      >
      </VueMultiselect>
      <button @click="model.weapon = undefined" :disabled="!model.weapon">X</button>
    </span>

    <span class="multiselect-wrapper">
      <VueMultiselect
        :options-limit="20"
        selectLabel=""
        deselectLabel="remove"
        placeholder="Search player"
        v-model="playerHighlighted"
        :options="sortedPlayerList"
        :allow-empty="true"
        :custom-label="((e: Player) => e?.username)"
      ></VueMultiselect>
      <button @click="playerHighlighted = undefined" :disabled="!playerHighlighted">X</button>
    </span>
  </div>

  <div id="playerView">
    <PlayerList
      :filters="filters"
      v-on:highlightPlayer="highlight_player"
      :playerHighlighted="playerHighlighted?.id"
    >
    </PlayerList>

    <PlayerChart
      :filters="filters"
      v-on:highlightPlayer="highlight_player"
      :playerHighlighted="playerHighlighted?.id"
    >
    </PlayerChart>
    <WeaponChart
      :filters="{ player: playerHighlighted?.id, ...filters }"
      :playerHighlighted="playerHighlighted?.id"
    >
    </WeaponChart>
  </div>
</template>

<script lang="ts">
import { Player, Weapon, Server, useKillStore, Filters } from '@/stores/kill'
import PlayerList from '@/components/PlayerList.vue'
import PlayerChart from '@/components/PlayerChart.vue'
import WeaponChart from '@/components/WeaponChart.vue'
import { Ref, defineComponent, unref } from 'vue'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import weapons from '../stores/weapons.json'
import router from '@/router'

export default defineComponent({
  name: 'PlayerView',
  components: {
    VueMultiselect,
    PlayerList,
    PlayerChart,
    WeaponChart
  },

  data () {
    return {
      model: { server: undefined, weapon: undefined } as unknown as {
        weapon: string | undefined;
        server: { name?: string } | (Server & { name?: string })[] | undefined;
      },
      filters: {} as Filters,
      store: useKillStore(),
      playerHighlighted: undefined as (Player & { id: string }) | undefined,
      weaponLocale: weapons as { [key: string]: string }
    }
  },
  created () {
    let server
    if (this.$route.query.server) server = { name: this.$route.query.server?.toString() }
    this.model = {
      server,
      weapon: this.$route.query.weapon?.toString()
    }
  },
  computed: {
    servers (): { [key: string]: Ref<Server> } {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { server: _, player: _1, ...withoutServer } = this.filters
      const data = this.store.getServerList(withoutServer)?.value.data
      if (!data) return unref(this.store.fetchServers(withoutServer)).data
      return data
    },
    groupedServers () {
      const hosts = [] as {
        id: number;
        servers: (Server & { name?: string })[];
      }[]
      Object.entries(this.servers).forEach((e) => {
        const server = unref(e[1])
        if (!hosts.find((host) => host.id === server.host)) { hosts.push({ id: server.host, servers: [] as Server[] }) }
        hosts
          .find((host) => host.id === server.host)
          ?.servers.push({ name: e[0], ...server })
      })
      console.log(hosts)
      return hosts
    },
    weapons (): { [key: string]: Ref<Weapon> } {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { weapon: _, player: _1, ...withoutWeapons } = this.filters
      const data = this.store.getWeaponList(withoutWeapons)?.value.data
      if (!data) return this.store.fetchWeapons(withoutWeapons).value.data
      return data
    },
    players (): { [key: string]: Ref<Player> } {
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
      const players = Object.entries(this.players).map((e) => ({
        id: e[0],
        ...e[1]._rawValue
      }))
      return players.sort((a, b) => {
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
    players () {
      const player = this.$route.query.player?.toString()
      if (player && this.playerHighlighted?.id !== player) {
        this.highlight_player(player)
      }
    },
    model: {
      handler (newModel) {
        this.filters.server = newModel.server?.name
        this.filters.weapon = newModel.weapon
      },
      deep: true
    },
    filters: {
      handler (newValue) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { server: _, weapon: _2, ...withoutFilters } = this.$route.query
        router.push({ query: { ...newValue, ...withoutFilters } })// .then(e => { console.log(e) })
      },
      deep: true
    },
    playerHighlighted (newValue, oldValue) {
      if (newValue?.id === oldValue?.id) return
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { player: _, ...withoutPlayer } = this.$route.query
      router.push({ query: { player: newValue?.id, ...withoutPlayer } })// .then(e => { console.log(e) })
    },
    '$route' (to) {
      if (this.playerHighlighted?.id !== to.query.player) {
        const playerId = to.query.player?.toString()
        if (playerId) {
          this.highlight_player(playerId)
        }
      }
      if (this.filters.weapon !== to.query.weapon) {
        this.model.weapon = to.query.weapon
      }
      if (this.filters.server !== to.query.server) {
        if (to.query.server) this.model.server = { name: to.query.server }
        else this.model.server = undefined
      }
    }
  },
  methods: {
    highlight_player (playerid: string) {
      const player = this.players[playerid]
      if (player) {
        this.playerHighlighted = { id: playerid, ...unref(player) }
        return
      }
      this.playerHighlighted = undefined
    }
  }
})
</script>

<style scoped>
.multiselect {
  margin: 0 0.5em 1em 0.5em;
}

.multiselect-wrapper {
  display: flex;
}

.multiselect-wrapper button {
  margin: 0 0 1em 0;
  font-size: 16px;
}

#playerView {
  margin: 0 1rem 1rem 1rem;
  /* height:100%; */
  display: grid;
  overflow: auto;
  grid-template-areas:
    "list chart"
    "list info";
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
}

@media only screen and (max-width: 922px) {
  #playerView {
    margin: 0 1rem 1rem 1rem;
    /* height:100%; */
    display: grid;
    overflow: auto;
    grid-template-areas: "list list";
    grid-template-columns: 100%;
    grid-template-rows: 100%;
    width: calc(100vw - 1em);
    margin: 0 0rem 1rem 1rem;
  }

  .multiselect-wrapper button {
    margin: 0 0.5em 1em 0;
  }

  .multiselect {
    width: calc(100% - 1em);
  }

  .playerChart {
    display: none;
  }

  .weaponChart {
    display: none;
  }
}

#filters {
  grid-area: filters;
}
</style>
