<template>
  <div class="playerTable" v-on:keydown="selectNextPlayer" tabindex="0">
    <div class="playerHeaders">
      <span></span>
      <span v-on:click="updateSort('username')"
        :class="sortingData.argument == 'username' ? 'selected' : ''">Username</span>
      <span v-on:click="updateSort('kills')" :class="sortingData.argument == 'kills' ? 'selected' : ''">K</span>
      <span v-on:click="updateSort('deaths')" :class="sortingData.argument == 'deaths' ? 'selected' : ''">D</span>
      <span v-on:click="updateSort('k/d')" :class="sortingData.argument == 'k/d' ? 'selected' : ''">K/D</span>
      <span v-on:click="updateSort('max_distance')"
        :class="sortingData.argument == 'max_distance' ? 'selected' : ''">max distance</span>
      <span v-on:click="updateSort('avg_distance')"
        :class="sortingData.argument == 'avg_distance' ? 'selected' : ''">average distance</span>
    </div>
    <div :class="'playerRow ' + (player.id === $props.playerHighlighted ? 'selected' : '')"
      v-for="(player, index) in playerList" v-bind:key="player.id" v-on:click="$emit('highlightPlayer', player.id)"
      :ref="`player:` + player.id">
      <div><span>{{ index+1 }}</span></div>
      <div><span>{{ player.username }}</span></div>
      <div><span>{{ player.kills }}</span></div>
      <div><span>{{ player.deaths }}</span></div>
      <div><span>{{ Math.round(player.kills / Math.max(1, player.deaths) * 100) / 100 }}</span></div>
      <div><span>{{ player.max_distance }}</span></div>
      <div><span>{{ Math.round(((player.total_distance / player.kills) || 0) * 100) / 100 }}</span></div>
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
      store: useKillStore()
    }
  },
  computed: {
    players (): { [key: string]: Player } {
      const { player: _, ...withoutPlayer } = this.filters
      const data = this.store.getPlayerList(withoutPlayer)?.value.data
      if (!data) return this.store.fetchPlayers(withoutPlayer).value.data
      return data
    },
    playerList ():(Player & {id:string})[] {
      if (!this.players) return []
      let players = Object.entries(this.players).map(e => ({ id: e[0], ...e[1] }))

      if (this.sortingData.argument === 'username') {
        const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
        players.sort((a: Player, b: Player) => {
          return collator.compare(a.username, b.username)
        })
      } else if (this.sortingData.argument === 'k/d') {
        players.sort((a: Player, b: Player) => {
          return a.kills / Math.max(1, a.deaths) - b.kills / Math.max(1, b.deaths)
        })
      } else if (this.sortingData.argument === 'avg_distance') {
        players.sort((a: Player, b: Player) => {
          return ((a.total_distance / a.kills) || 0) - ((b.total_distance / b.kills) || 0)
        })
      } else {
        const argument = this.sortingData.argument
        players.sort((a: Player, b: Player) => {
          return a[argument] - b[argument]
        })
      }

      if (this.sortingData.direction < 0) {
        players.reverse()
      }

      players = players.slice(0, 500)
      return players
    }
  },
  watch: {
    playerHighlighted (newval) {
      console.log('newVal')
      const newElement = this.$refs['player:' + newval] as HTMLElement[]
      // Some hack because of some inconsistency
      setTimeout(function () {
        if (newElement && newElement[0]) { newElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' }) }
      }, 0)
    }
  },
  updated () {
    const element = this.$refs['player:' + this.$props.playerHighlighted] as HTMLElement[]
    if (!element || !element[0]) return
    element[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
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
    updateSort (argument:string) {
      if (this.sortingData.argument === argument) {
        this.sortingData.direction *= -1
      } else {
        this.sortingData.direction = -1
      }
      this.sortingData.argument = argument as typeof this.sortingData.argument
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
