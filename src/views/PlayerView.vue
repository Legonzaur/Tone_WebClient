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
        :close-on-select="false"
        :multiple="true"
      >
      </VueMultiselect>
      <button @click="model.server = undefined" :disabled="!model.server">X</button>
    </span>

    <span class="multiselect-wrapper">
      <VueMultiselect
        selectLabel=""
        deselectLabel="remove"
        placeholder="Select gamemode"
        v-model="model.gamemode"
        :options="sortedGamemodeList"
        :allow-empty="true"
        :close-on-select="false"
        :multiple="true"
      >
      </VueMultiselect>
      <button @click="model.gamemode = undefined" :disabled="!model.gamemode">X</button>
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
    <button @click="applyFilters" :disabled="filters.server == model.server && filters.gamemode == model.gamemode && filters.weapon == model.weapon">Apply Filters</button>
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
import { Player, Weapon, Server, Kill, useKillStore, Filter } from '@/stores/kill'
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
        weapon: string[] | undefined;
        server: string[] | undefined;
        gamemode: string[] | undefined;
      },
      filters: new Filter(),
      store: useKillStore(),
      playerHighlighted: undefined as (Player & { id: string }) | undefined,
      weaponLocale: weapons as { [key: string]: string }
    }
  },
  beforeCreate () {
    let server
    if (this.$route.query.server) server = [this.$route.query.server?.toString()]
    this.model = {
      server,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      weapon: [this.$route.query.weapon].flat().filter(e => e ?? false).map(e => e!.toString()),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      gamemode: [this.$route.query.gamemode].flat().filter(e => e ?? false).map(e => e!.toString())
    }
  },
  computed: {
    servers (): { [key: string]: Ref<Server> } {
      const filter = new Filter(this.filters)
      delete filter.server
      const data = this.store.getList('servers', filter)?.value.data
      if (!data) return unref(this.store.fetch('servers', filter)).data
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
      return hosts
    },
    weapons (): { [key: string]: Ref<Weapon> } {
      const filter = new Filter(this.filters)
      delete filter.weapon
      delete filter.player
      const data = this.store.getList('weapons', filter)?.value.data
      if (!data) return this.store.fetch('weapons', filter).value.data
      return data
    },
    players (): { [key: string]: Ref<Player> } {
      const filter = new Filter(this.filters)
      delete filter.player
      const data = this.store.getList('players', filter)?.value.data
      if (!data) return this.store.fetch('players', filter).value.data
      return data
    },
    gamemodes (): { [key: string]: Ref<Kill> } {
      const filter = new Filter(this.filters)
      delete filter.gamemode
      delete filter.player
      const data = this.store.getList('gamemodes', filter)?.value.data
      if (!data) return this.store.fetch('gamemodes', filter).value.data
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
    sortedGamemodeList (): string[] {
      if (!this.gamemodes) return []
      const gamemodes = Object.keys(this.gamemodes)
      return gamemodes.sort()
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
    filters: {
      handler (newValue) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { server: _, weapon: _2, gamemode: _3, ...withoutFilters } = this.$route.query
        router.push({ query: { ...newValue, ...withoutFilters } })// .then(e => { console.log(e) })
        this.store.setFilter({ player: this.store.currentFilter.player, ...newValue })
      },
      deep: true
    },
    playerHighlighted (newValue, oldValue) {
      if (newValue?.id === oldValue?.id) return
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { player: _, ...withoutPlayer } = this.$route.query
      router.push({ query: { player: newValue?.id, ...withoutPlayer } })// .then(e => { console.log(e) })
      this.store.setFilter({ ...this.store.currentFilter, player: newValue?.id })
    },
    $route: {
      handler: function () {
        this.applyRouteFilters()
      },
      immediate: true
    }
  },
  methods: {
    applyFilters () {
      this.filters.server = this.model.server
      this.filters.weapon = this.model.weapon
      this.filters.gamemode = this.model.gamemode
    },
    highlight_player (playerid: string) {
      const player = this.players[playerid]
      if (player) {
        this.playerHighlighted = { id: playerid, ...unref(player) }
        return
      }
      this.playerHighlighted = undefined
    },
    applyRouteFilters () {
      if (this.playerHighlighted?.id !== this.$route.query.player) {
        const playerId = this.$route.query.player?.toString()
        if (playerId) {
          this.highlight_player(playerId)
        }
      }
      if (this.filters.weapon !== this.$route.query.weapon) {
        this.model.weapon = [this.$route.query.weapon].flat().filter(e => e ?? false).map(e => e!.toString())
      }
      if (this.filters.server !== this.$route.query.server) {
        if (this.$route.query.server) this.model.server = [this.$route.query.server].flat().filter(e => e ?? false).map(e => e!.toString())
        else this.model.server = undefined
      }
      if (this.filters.gamemode !== this.$route.query.gamemode) {
        if (this.$route.query.gamemode) this.model.gamemode = [this.$route.query.gamemode].flat().filter(e => e ?? false).map(e => e!.toString())
        else this.model.gamemode = undefined
      }
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
