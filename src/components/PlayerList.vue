<template>
  <div class="playerTable" v-on:keydown="selectNextPlayer" tabindex="0">
    <div class="playerHeaders">
      <span></span>
      <span v-on:click="sortPlayerList('username')" :class="sortingData.argument == 'username' ? 'selected' : ''">username</span>
      <span v-on:click="sortPlayerList('kills')" :class="sortingData.argument == 'kills' ? 'selected' : ''">kills</span>
      <span v-on:click="sortPlayerList('deaths')" :class="sortingData.argument == 'deaths' ? 'selected' : ''">deaths</span>
      <span v-on:click="sortPlayerList('k/d')" :class="sortingData.argument == 'k/d' ? 'selected' : ''">k/d</span>
      <span v-on:click="sortPlayerList('max_kill_distance')" :class="sortingData.argument == 'max_kill_distance' ? 'selected' : ''">max kill distance</span>
      <span v-on:click="sortPlayerList('avg_kill_distance')" :class="sortingData.argument == 'avg_kill_distance' ? 'selected' : ''">average kill distance</span>
    </div>
    <div class="playerRow" v-for="(playerId, index) in playerIdList" v-bind:key="playerId"
      v-on:click="$emit('highlightPlayer', playerId)" :ref="`player:` + playerId">
      <span>{{ index }}</span>
      <span>{{ players[playerId].username }}</span>
      <span>{{ players[playerId].kills }}</span>
      <span>{{ players[playerId].deaths }}</span>
      <span>{{ Math.round(players[playerId].kills / players[playerId].deaths * 100) / 100 }}</span>
      <span>{{ players[playerId].max_kill_distance }}</span>
      <span>{{ Math.round(players[playerId].avg_kill_distance * 100) / 100 }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Player } from '@/store/index'
import { useStore } from 'vuex'
import { Vue } from 'vue-class-component'

export default defineComponent({
  props: {
    filters: Object,
    playerHighlighted: String
  },
  emits: ['highlightPlayer'],
  data () {
    return {
      sortingData: { direction: -1, argument: 'kills' as keyof Player | 'k/d' },
      playerIdList: [] as string[],
      store: useStore(),
      selected: undefined as string | undefined
    }
  },
  computed: {
    players (): { [key: string]: Player } { return this.store.getters.getPlayerList(this.filters) }
  },
  watch: {
    players: {
      handler (newval: { [key: string]: Player }): void {
        if (!newval) return
        this.playerIdList = []
        this.sortingData.direction *= -1
        this.playerIdList = Object.keys(newval)
        this.sortPlayerList(this.sortingData.argument)
        this.$nextTick(() => {
          const element = (this.$refs['player:' + this.selected] as HTMLElement[])
          if (element && element.length > 0) element[0].classList.add('selected')
        })
      },
      immediate: true
    },
    playerHighlighted (newval, oldval) {
      const oldElement = this.$refs['player:' + oldval] as HTMLElement[]
      if (oldElement) {
        oldElement[0].classList.remove('selected')
        delete this.selected
      }
      const newElement = this.$refs['player:' + newval] as HTMLElement[]
      if (!newElement) return
      newElement[0].classList.add('selected')
      newElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.selected = newval
    }
  },
  updated () {
    const element = this.$refs['player:' + this.$props.playerHighlighted] as HTMLElement[]
    if (!element || !element[0]) return
    element[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
  },
  methods: {
    sortPlayerList (arg: ((keyof Player) | 'k/d')) {
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
          varA = this.players[a].kills / this.players[a].deaths
          varB = this.players[b].kills / this.players[b].deaths
        } else {
          varA = this.players[a][arg]
          varB = this.players[b][arg]
        }

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
      if (!this.selected) return
      if (!Object.keys(values).includes(e.key)) return
      e.preventDefault()
      const index = this.playerIdList.indexOf(this.selected)
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
  margin-right: 1rem;
  overflow: auto;
  height: 100%;
}

.playerHeaders {
  position: sticky;
  top: 0px;
}

.playerRow,
.playerHeaders {
  display: grid;
  grid-template-columns: 4ch 2fr 6ch 6ch 6ch 10ch 1fr;
  background: var(--bg-color);
  text-align: left;
  cursor: pointer;
  margin: 0;
  /* border: 2px solid transparent; */
  transition: border .25s;
}

.playerHeaders,
.playerRow:nth-child(2n) {
  background: var(--current-line);
}

.playerRow:nth-child(2n+1) {
  background: var(--accent);
}

.playerHeaders span:hover,
.playerRow:hover {
  background: var(--bg-color);
}

.playerRow>span:not(:last-child),
.playerHeaders>span:not(:last-child) {
  border-right: solid var(--bg-color) 2px;
}

.playerHeaders>span:last-child {
  width:100%;
}

span {
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;
}

.player span {
  pointer-events: none;
}

.selected {
  background: var(--comment) !important;
}</style>
