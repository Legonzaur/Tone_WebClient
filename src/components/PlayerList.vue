<template>
  <div class="playerTable" v-on:keydown="selectNextPlayer" tabindex="0">
    <div class="playerHeaders">
      <span></span>
      <span v-on:click="sortPlayerList('username')"
        :class="sortingData.argument == 'username' ? 'selected' : ''">Username</span>
      <span v-on:click="sortPlayerList('kills')" :class="sortingData.argument == 'kills' ? 'selected' : ''">K</span>
      <span v-on:click="sortPlayerList('deaths')" :class="sortingData.argument == 'deaths' ? 'selected' : ''">D</span>
      <span v-on:click="sortPlayerList('k/d')" :class="sortingData.argument == 'k/d' ? 'selected' : ''">K/D</span>
      <span v-on:click="sortPlayerList('max_distance')"
        :class="sortingData.argument == 'max_distance' ? 'selected' : ''">max distance</span>
      <span v-on:click="sortPlayerList('avg_distance')"
        :class="sortingData.argument == 'avg_distance' ? 'selected' : ''">average distance</span>
    </div>
    <div :class="'playerRow ' + (playerId === $props.playerHighlighted ? 'selected' : '')"
      v-for="(playerId, index) in playerIdList" v-bind:key="playerId" v-on:click="$emit('highlightPlayer', playerId)"
      :ref="`player:` + playerId">
      <div><span>{{ index+1 }}</span></div>
      <div><span>{{ players[playerId].username }}</span></div>
      <div><span>{{ players[playerId].kills }}</span></div>
      <div><span>{{ players[playerId].deaths }}</span></div>
      <div><span>{{ Math.round(players[playerId].kills / Math.max(1, players[playerId].deaths) * 100) / 100 }}</span></div>
      <div><span>{{ players[playerId].max_distance }}</span></div>
      <div><span>{{ Math.round(((players[playerId].total_distance / players[playerId].kills) || 0) * 100) / 100 }}</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useKillStore, Player, Filters } from '@/stores/kill'

export default defineComponent({
  props: {
    filters: { type: Object as PropType<Filters>, default: () => ({}) },
    playerHighlighted: String
  },
  emits: ['highlightPlayer'],
  data () {
    return {
      sortingData: { direction: -1, argument: 'kills' as keyof Player | 'k/d' | 'avg_distance' },
      playerIdList: [] as string[],
      store: useKillStore()
    }
  },
  computed: {
    players (): { [key: string]: Player } {
      const { player: _, ...withoutPlayer } = this.filters
      const data = this.store.getPlayerList(withoutPlayer)?.value.data
      if (!data) return this.store.fetchPlayers(withoutPlayer).value.data
      return data
    }
  },
  watch: {
    players: {
      handler (newval: { [key: string]: Player }): void {
        if (!newval) return
        this.playerIdList = []
        this.sortingData.direction *= -1
        this.playerIdList = Object.keys(newval)
        this.sortPlayerList(this.sortingData.argument)
        this.playerIdList = this.playerIdList.slice(0, 500)
      },
      immediate: true
    },
    playerHighlighted (newval) {
      const newElement = this.$refs['player:' + newval] as HTMLElement[]
      if (newElement && newElement[0]) { newElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' }) }
    }
  },
  updated () {
    const element = this.$refs['player:' + this.$props.playerHighlighted] as HTMLElement[]
    if (!element || !element[0]) return
    element[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
  },
  methods: {
    sortPlayerList (arg: ((keyof Player) | 'k/d' | 'avg_distance')) {
      if (arg === this.sortingData.argument) {
        this.sortingData.direction *= -1
      } else {
        if (arg === 'username') {
          this.sortingData.direction = 1
        }
      }
      this.sortingData.argument = arg

      this.playerIdList.sort((a: string, b: string) => {
        if (!this.players) {
          return 0
        }
        let varA, varB
        if (arg === 'k/d') {
          varA = this.players[a].kills / Math.max(1, this.players[a].deaths)
          varB = this.players[b].kills / Math.max(1, this.players[b].deaths)
        } else if (arg === 'avg_distance') {
          varA = (this.players[a].total_distance / this.players[a].kills) || 0
          varB = (this.players[b].total_distance / this.players[b].kills) || 0
        } else {
          varA = this.players[a][arg]
          varB = this.players[b][arg]
        }
        if (varA === undefined || varB === undefined) return 0
        if (varA < varB) {
          return -1 * this.sortingData.direction
        }
        if (varA > varB) {
          return 1 * this.sortingData.direction
        }
        return 0
      })
    },
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
      const index = this.playerIdList.indexOf(this.$props.playerHighlighted)
      let nextIndex = (index + values[e.key])
      if (nextIndex >= this.playerIdList.length) nextIndex = this.playerIdList.length - 1
      if (nextIndex < 0) nextIndex = 0
      this.$emit('highlightPlayer', this.playerIdList[nextIndex])
    }
  }

})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.playerTable {
  grid-area: list;
  margin-right: 1rem;
  overflow: auto;
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

.playerHeaders {
  position: sticky;
  top: 0;
  height: 3em;
}

.playerHeaders>span {
  padding: .5em .8em 0 .25em;
}

.playerRow>div {
  padding: .5em .8em 0 .25em;
  overflow: hidden;
}

.playerHeaders,
.playerRow:nth-child(2n) {
  background: var(--current-line);
}

.playerRow:nth-child(2n+1) {
  background: var(--accent);
}

.playerHeaders div:hover,
.playerRow:hover {
  background: var(--bg-color);
}

.playerRow>div:not(:last-child),
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
}</style>
