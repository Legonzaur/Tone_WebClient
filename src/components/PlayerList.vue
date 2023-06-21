<template>
  <div class="playerTable" v-on:keydown="selectNextPlayer" tabindex="0">
    <div class="playerHeaders">
      <span></span>
      <span v-on:click="updateSort('username')"
        :class="sortingData.argument == 'username' ? 'selected' : ''">Username</span>
      <span v-on:click="updateSort('kills')" :class="sortingData.argument == 'kills' ? 'selected' : ''">K</span>
      <span v-on:click="updateSort('deaths')" :class="sortingData.argument == 'deaths' ? 'selected' : ''">D</span>
      <span v-on:click="updateSort('k/d')" :class="sortingData.argument == 'k/d' ? 'selected' : ''">K/D</span>
      <span v-on:click="updateSort('max_distance')" :class="sortingData.argument == 'max_distance' ? 'selected' : ''">Max
        distance</span>
      <span v-on:click="updateSort('avg_distance')"
        :class="sortingData.argument == 'avg_distance' ? 'selected' : ''">Average distance</span>
    </div>
    <LoadingBar v-if="progress!==1" :value="progress"></LoadingBar>
    <VirtualList :list="playerList" :row-height="32" v-slot="slotProps" :highlighted="playerHighlighted" v-if="progress===1">
      <div :class="'playerRow ' + (slotProps.data.id === playerHighlighted ? 'selected ' : '') + ((slotProps.index + 1)%2 ? 'odd ':'uneven ')" v-on:click="$emit('highlightPlayer', slotProps.data.id)">
        <div><span>{{ slotProps.index+1 }}</span></div>
        <div><span>{{ slotProps.data.value.username }}</span></div>
        <div><span>{{ slotProps.data.value.kills }}</span></div>
        <div><span>{{ slotProps.data.value.deaths }}</span></div>
        <div><span>{{ Math.round(slotProps.data.value.kills / Math.max(1, slotProps.data.value.deaths) * 100) / 100 }}</span></div>
        <div><span>{{ slotProps.data.value.max_distance }}</span></div>
        <div><span>{{ Math.round(((slotProps.data.value.total_distance / slotProps.data.value.kills) || 0) * 100) / 100 }}</span></div>
      </div>
    </VirtualList>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, isRef } from 'vue'
import { useKillStore, Player, Filter } from '@/stores/kill'
import VirtualList from './List/VirtualList.vue'
import LoadingBar from './LoadingBar.vue'

export default defineComponent({
  components: { VirtualList, LoadingBar },
  props: {
    filters: { type: Object as PropType<Filter>, default: () => ({}) },
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
    progress () {
      const filter = new Filter(this.filters)
      delete filter.player
      return this.store.getList('players', filter)?.value.progress.value
    },
    players (): { [key: string]: Ref<Player> } {
      const filter = new Filter(this.filters)
      delete filter.player
      const data = this.store.getList('players', filter)?.value.data
      if (!data) return this.store.fetch('players', filter).value.data
      return data
    },
    playerList (): (Ref<Player> & { id: string })[] {
      const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
      const sortingFunctions = {
        'k/d': ({ _rawValue: aVal }, { _rawValue: bVal }) => aVal.kills / Math.max(1, aVal.deaths) - bVal.kills / Math.max(1, bVal.deaths),
        avg_distance: ({ _rawValue: aVal }, { _rawValue: bVal }) => ((aVal.total_distance / aVal.kills) || 0) - ((bVal.total_distance / bVal.kills) || 0),
        username: ({ _rawValue: aVal }, { _rawValue: bVal }) => collator.compare(aVal.username, bVal.username)
      } as {[k: string]: (a:Ref<Player>, b:Ref<Player>)=>number}

      if (!this.players) return []
      const players = Object.entries(this.players).map(e => {
        const target = {} as ProxyHandler<Ref<Player>>
        const player = new Proxy(e[1], target) as Ref<Player> & { id: string }
        player.id = e[0]
        return player
      }) as (Ref<Player> & { id: string })[]

      if (this.sortingData.argument in sortingFunctions) {
        players.sort(sortingFunctions[this.sortingData.argument])
      } else {
        const argument = this.sortingData.argument as Exclude<keyof Player, 'username' | 'avg_distance'>
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
  margin-right: 1rem;
  height: 100%;
  user-select: none;
}

.playerRow,
.playerHeaders {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 6ch 20ch 6ch 6ch 6ch 10ch 1fr;
  background: var(--bg-color);
  text-align: left;
  cursor: pointer;
  margin: 0;
  /* border: 2px solid transparent; */
  transition: border .25s;
  height: 2em;
}

.playerRow.odd {
  background: var(--accent);
}

.playerRow.uneven {
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
    grid-template-columns: 6ch 20ch 6ch 6ch 1fr;
  }
}

.player span {
  pointer-events: none;
}

.selected {
  background: var(--comment) !important;
}
</style>
