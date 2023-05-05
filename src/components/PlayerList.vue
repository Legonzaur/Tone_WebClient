<template>
  <div class="playerTable" v-on:keydown="selectNextPlayer" tabindex="0">
    <div class="playerHeaders">
      <span></span>
      <span v-on:click="updateSort('username')"
        :class="sortingData.argument == 'username' ? 'selected' : ''">Username</span>
      <span v-on:click="updateSort('kills')" :class="sortingData.argument == 'kills' ? 'selected' : ''">K</span>
      <span v-on:click="updateSort('deaths')" :class="sortingData.argument == 'deaths' ? 'selected' : ''">D</span>
      <span v-on:click="updateSort('k/d')" :class="sortingData.argument == 'k/d' ? 'selected' : ''">K/D</span>
      <span v-on:click="updateSort('max_distance')" :class="sortingData.argument == 'max_distance' ? 'selected' : ''">max
        distance</span>
      <span v-on:click="updateSort('avg_distance')"
        :class="sortingData.argument == 'avg_distance' ? 'selected' : ''">average distance</span>
    </div>
    <VirtualList :list="playerList" :row-height="32" v-slot="slotProps">
      <div :class="'playerRow ' + (slotProps.data.id === $props.playerHighlighted ? 'selected' : '')" v-on:click="$emit('highlightPlayer', slotProps.data.id)">
        <div><span>{{ slotProps.index+1 }}</span></div>
        <div><span>{{ slotProps.data.value.username }}</span></div>
        <div><span>{{ slotProps.data.value.kills }}</span></div>
        <div><span>{{ slotProps.data.value.deaths }}</span></div>
        <div><span>{{ Math.round(slotProps.data.value.kills / Math.max(1, slotProps.data.value.deaths) * 100) / 100 }}</span></div>
        <div><span>{{ slotProps.data.value.max_distance }}</span></div>
        <div><span>{{ Math.round(((slotProps.data.value.total_distance / slotProps.data.value.kills) || 0) * 100) / 100 }}</span></div>
      </div>
    </VirtualList>
    <!-- <div :class="'playerRow ' + (player.id === $props.playerHighlighted ? 'selected' : '')"
       v-on:click="$emit('highlightPlayer', player.id)"
      :ref="`player:` + player.id">
      <div><span>{{ index+1 }}</span></div>
      <div><span>{{ player.value.username }}</span></div>
      <div><span>{{ player.value.kills }}</span></div>
      <div><span>{{ player.value.deaths }}</span></div>
      <div><span>{{ Math.round(player.value.kills / Math.max(1, player.value.deaths) * 100) / 100 }}</span></div>
      <div><span>{{ player.value.max_distance }}</span></div>
      <div><span>{{ Math.round(((player.value.total_distance / player.value.kills) || 0) * 100) / 100 }}</span></div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref } from 'vue'
import { useKillStore, Player, Filters } from '@/stores/kill'
import VirtualList from './List/VirtualList.vue'

export default defineComponent({
  components: { VirtualList },
  props: {
    filters: { type: Object as PropType<Filters>, default: () => ({}) },
    playerHighlighted: String
  },
  emits: ['highlightPlayer'],
  data () {
    return {
      sortingData: { direction: -1, argument: 'kills' as keyof Player | 'k/d' | 'avg_distance' },
      store: useKillStore()
    }
  },
  computed: {
    players (): { [key: string]: Ref<Player> } {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { player: _, ...withoutPlayer } = this.filters
      const data = this.store.getPlayerList(withoutPlayer)?.value.data
      if (!data) return this.store.fetchPlayers(withoutPlayer).value.data
      return data
    },
    playerList (): (Ref<Player> & { id: string })[] {
      if (!this.players) return []
      const players = Object.entries(this.players).map(e => {
        const target = {} as ProxyHandler<Ref<Player>>
        const player = new Proxy(e[1], target) as Ref<Player> & { id: string }
        player.id = e[0]
        return player
      }) as (Ref<Player> & { id: string })[]

      const date = new Date()
      if (this.sortingData.argument === 'username') {
        const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
        players.sort((a, b) => {
          // Hack because toRaw is slow as fuck
          const aVal = a._rawValue
          const bVal = b._rawValue
          return collator.compare(aVal.username, bVal.username)
        })
      } else if (this.sortingData.argument === 'k/d') {
        players.sort((a, b) => {
          // Hack because toRaw is slow as fuck
          const aVal = a._rawValue
          const bVal = b._rawValue
          return aVal.kills / Math.max(1, aVal.deaths) - bVal.kills / Math.max(1, bVal.deaths)
        })
      } else if (this.sortingData.argument === 'avg_distance') {
        players.sort((a, b) => {
          // Hack because toRaw is slow as fuck
          const aVal = a._rawValue
          const bVal = b._rawValue
          return ((aVal.total_distance / aVal.kills) || 0) - ((bVal.total_distance / bVal.kills) || 0)
        })
      } else {
        const argument = this.sortingData.argument
        players.sort((a, b) => {
          // Hack because toRaw is slow as fuck
          const aVal = a._rawValue
          const bVal = b._rawValue
          return aVal[argument] - bVal[argument]
        })
      }
      if (this.sortingData.direction < 0) {
        players.reverse()
      }
      return players
    }
  },
  watch: {
    playerHighlighted (newval) {
      this.scrollToPlayer(newval)
    },
    playerList () {
      if (this.playerHighlighted) this.scrollToPlayer(this.playerHighlighted)
    }
  },
  updated () {
    /* const element = this.$refs['player:' + this.$props.playerHighlighted] as HTMLElement[]
    if (!element || !element[0]) return
    element[0].scrollIntoView({ behavior: 'smooth', block: 'center' }) */
  },
  methods: {
    selectNextPlayer (e: KeyboardEvent) {
      const values = {
        Home: -Infinity,
        End: Infinity,
        PageDown: 100,
        PageUp: -100,
        ArrowUp: -1,
        ArrowDown: 1,
        ArrowRight: 10,
        ArrowLeft: -10
      } as { [key: string]: number }
      if (!this.$props.playerHighlighted) return
      if (!Object.keys(values).includes(e.key)) return
      e.preventDefault()
      const index = this.playerList.findIndex(e => e.id === this.$props.playerHighlighted)
      let nextIndex = (index + values[e.key])
      if (nextIndex >= this.playerList.length) nextIndex = this.playerList.length - 1
      if (nextIndex < 0) nextIndex = 0
      this.$emit('highlightPlayer', this.playerList[nextIndex].id)
    },
    updateSort (argument: string) {
      if (this.sortingData.argument === argument) {
        this.sortingData.direction *= -1
      } else {
        this.sortingData.direction = -1
      }
      this.sortingData.argument = argument as typeof this.sortingData.argument
    },
    scrollToPlayer (playerid: string) {
      const newElement = this.$refs['player:' + playerid] as HTMLElement[]
      // Some hack because of some inconsistency
      setTimeout(function () {
        if (newElement && newElement[0]) { newElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' }) }
      }, 10)
    }
  }

})
</script>

<style>
.playerTable * {
  box-sizing: border-box;
}

.playerTable {
  grid-area: list;
  margin-right: 1rem;
  height: 100%;
  user-select: none;
}

.playerRow,
.playerHeaders {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 5ch 20ch 6ch 6ch 6ch 10ch 1fr;
  background: var(--bg-color);
  text-align: left;
  cursor: pointer;
  margin: 0;
  /* border: 2px solid transparent; */
  transition: border .25s;
  height: 2em;
}

.playerRow:nth-child(2n+1) {
  background: var(--accent);
}

.playerRow:nth-child(2n) {
  background: var(--bg-color);
}

.playerRow:hover {
  background: var(--current-line);
}

.playerRow>div:not(:last-child){
  border-right: solid var(--bg-color) 2px;
}

.playerRow>div {
  padding: .5em .8em 0 .25em;
  overflow: hidden;
}

.playerHeaders {
  position: sticky;
  top: 0;
  height: 3em;
}

.playerHeaders>span {
  padding: .5em .8em 0 .25em;
}

.playerHeaders{
  background: var(--current-line);
}

.playerHeaders div:hover {
  background: var(--bg-color);
}

.playerHeaders>div:not(:last-child) {
  border-right: solid var(--bg-color) 2px;
}

.playerHeaders>span:last-child {
  width: 100%;
}

@media only screen and (max-width: 600px) {

  .playerRow>div:nth-child(6),
  .playerHeaders>span:nth-child(6),
  .playerRow>div:nth-child(7),
  .playerHeaders>span:nth-child(7) {
    display: none;
  }

  .playerRow,
  .playerHeaders {
    grid-template-columns: 5ch 20ch 6ch 6ch 1fr;
  }
}

.player span {
  pointer-events: none;
}

.selected {
  background: var(--comment) !important;
}
</style>
