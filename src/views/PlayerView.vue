<template>
  <div id="filters">
    <span class="multiselect-wrapper">

      <!-- group-values="servers"
        group-label="id"
        label="name"
        :group-select="true"
        :options="groupedServers" -->
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
        :custom-label="((e: any) => gamemodeLocale[e] || e)"
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
    <button @click="applyFilters" :disabled="filters.server == model.server && filters.gamemode == model.gamemode && filters.weapon == model.weapon">Apply Filters</button>
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
    <GamemodeChart
      :filters="{ player: playerHighlighted?.id, ...filters }"
      :playerHighlighted="playerHighlighted?.id"
    ></GamemodeChart>
  </div>
</template>

<script lang="ts">
import { Player, Weapon, Server, Kill, useKillStore, Filter } from '@/stores/kill'
import PlayerList from '@/components/PlayerList.vue'
import PlayerChart from '@/components/PlayerChart.vue'
import WeaponChart from '@/components/WeaponChart.vue'
import GamemodeChart from '@/components/GamemodeChart.vue'
import { Ref, defineComponent, unref } from 'vue'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import weapons from '../stores/weapons.json'
import gamemodes from '../stores/gamemodes.json'
import router from '@/router'

function filterOutNull<T> (value:T | null):value is T {
  return value !== null
}

export default defineComponent({
  name: 'PlayerView',
  components: {
    VueMultiselect,
    PlayerList,
    PlayerChart,
    WeaponChart,
    GamemodeChart
  },

  data () {
    return {
      model: { } as unknown as {
        weapon: string[] | undefined;
        server: string[] | undefined;
        gamemode: string[] | undefined;
      },
      filters: new Filter(),
      store: useKillStore(),
      playerHighlighted: undefined as (Player & { id: string }) | undefined,
      weaponLocale: weapons as { [key: string]: string },
      gamemodeLocale: gamemodes as { [key: string]: string }
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
      const data = this.store.getList('servers')?.value.data
      if (!data) return unref(this.store.fetch('servers')).data
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
      // const filter = new Filter(this.filters)
      // delete filter.weapon
      // delete filter.player
      const data = this.store.getList('weapons')?.value.data
      if (!data) return this.store.fetch('weapons').value.data
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
      // const filter = new Filter(this.filters)
      // delete filter.gamemode
      // delete filter.player
      const data = this.store.getList('gamemodes')?.value.data
      if (!data) return this.store.fetch('gamemodes').value.data
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
    model: {
      handler () {
        if (this.model.gamemode?.length === 0) this.model.gamemode = undefined
        if (this.model.server?.length === 0) this.model.server = undefined
        if (this.model.weapon?.length === 0) this.model.weapon = undefined
      },
      deep: true
    },
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
        if (this.$route.query.weapon) this.model.weapon = [this.$route.query.weapon].flat().filter(filterOutNull).map(e => e.toString())
        else this.model.weapon = undefined
      }
      if (this.filters.server !== this.$route.query.server) {
        if (this.$route.query.server) this.model.server = [this.$route.query.server].flat().filter(filterOutNull).map(e => e.toString())
        else this.model.server = undefined
      }
      if (this.filters.gamemode !== this.$route.query.gamemode) {
        if (this.$route.query.gamemode) this.model.gamemode = [this.$route.query.gamemode].flat().filter(filterOutNull).map(e => e.toString())
        else this.model.gamemode = undefined
      }
      this.applyFilters()
    }
  }
})
</script>

<style>
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
    "list chart chart"
    "list info1 info2";
  grid-template-columns: 50% 25% 25%;
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
    grid-area: "chart";
  }

  .weaponChart {
    display: none;
    grid-area: 'info1';
  }
  .gamemodeChart{
    display:none;
    grid-area: 'info2';
  }
  .playerTable{
    grid-area: 'list';
  }
}

.playerChart {
    grid-area: chart;
  }

  .weaponChart {
    grid-area: info1;
  }
  .gamemodeChart{
    grid-area: info2;
  }
  .playerTable{
    grid-area: list;
  }

#filters {
  grid-area: filters;
}
</style>
