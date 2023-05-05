<template>
  <div ref="vlist" class="vlist" @scroll="scroll">
    <div ref="vscroll" class="vscroll" :style="`padding: ${(vIndex*$props.rowHeight!)}px 0px ${(list.length*$props.rowHeight!)-(vIndex*$props.rowHeight!)}px;`">
      <div :class="'playerRow ' + (player.id === $props.highlighted ? 'selected' : '')" v-for="(player, index) in visibleList"
        v-bind:key="player.id" v-on:click="$emit('highlightPlayer', player.id)" :ref="`player:` + player.id">
        <div><span>{{ index + 1 + vIndex }}</span></div>
        <div><span>{{ player.value.username }}</span></div>
        <div><span>{{ player.value.kills }}</span></div>
        <div><span>{{ player.value.deaths }}</span></div>
        <div><span>{{ Math.round(player.value.kills / Math.max(1, player.value.deaths) * 100) / 100 }}</span></div>
        <div><span>{{ player.value.max_distance }}</span></div>
        <div><span>{{ Math.round(((player.value.total_distance / player.value.kills) || 0) * 100) / 100 }}</span></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Player } from '@/stores/kill'
import { defineComponent, PropType, Ref } from 'vue'

export default defineComponent({
  data () {
    return {
      toLoad: 10,
      vlistHeight: 10,
      vIndex: 0
    }
  },
  props: {
    list: { type: Array as PropType<(Ref<Player> & { id: string })[]>, default: () => [] },
    rowHeight: { type: Number, default: () => 32 },
    highlighted: String
  },
  emits: ['highlightPlayer'],
  mounted () {
    if (this.$props.list) {
      this.vlistHeight = (this.$refs.vlist as HTMLElement)?.getBoundingClientRect().height || 0
      if (this.$props.highlighted) {
        setTimeout(() => (this.$refs.vlist as HTMLElement)?.scrollBy({ top: ((this.list.findIndex(e => e.id === this.$props.highlighted)) * this.rowHeight) - ((this.$refs.vlist as HTMLElement))?.scrollTop - (this.vlistHeight / 2 - this.$props.rowHeight), behavior: 'smooth' }), 1)
      }
    }
  },
  computed: {
    visibleList () {
      return this.list.slice(Math.max(this.vIndex, 0), Math.min(this.vIndex + this.visibleCount * 3, this.list.length))
    },
    visibleCount () {
      return Math.ceil(this.vlistHeight / this.$props.rowHeight)
    }
  },
  watch: {
    list () {
      this.vlistHeight = (this.$refs.vlist as HTMLElement)?.getBoundingClientRect().height || 0
    },
    highlighted (newVal) {
      if (newVal) setTimeout(() => (this.$refs.vlist as HTMLElement)?.scrollBy({ top: ((this.list.findIndex(e => e.id === newVal)) * this.rowHeight) - ((this.$refs.vlist as HTMLElement))?.scrollTop - (this.vlistHeight / 2 - this.$props.rowHeight), behavior: 'smooth' }), 1)
    }
  },
  methods: {
    scroll (e:Event) {
      const scrollTop = (e.target as HTMLElement)?.scrollTop
      const scrollIndex = Math.round(scrollTop / this.$props.rowHeight)

      const mustScrollUp = Math.max(0, scrollIndex - (this.visibleCount)) < this.vIndex
      const mustScrollDown = Math.min(this.list.length, scrollIndex + (this.visibleCount)) > this.vIndex + (this.visibleCount * 2)
      if (mustScrollUp) {
        this.vIndex = Math.max(0, Math.floor((scrollIndex - this.visibleCount) / 4) * 4)
      } else if (mustScrollDown) {
        this.vIndex = Math.max(0, Math.floor(scrollIndex / 4) * 4)
      }
    }
  }

})
</script>

<style scoped>
.vlist{
  overflow-y:auto;
}
.vlist, .vscroll {
  height: calc(100% - 3em);
}

.playerRow:nth-child(2n+1) {
  background: var(--accent);
}

.playerRow:nth-child(2n) {
  background: var(--current-line);
}

.playerRow:hover {
  background: var(--bg-color);
}

.playerRow>div:not(:last-child){
  border-right: solid var(--bg-color) 2px;
}

.playerRow>div {
  padding: .5em .8em 0 .25em;
  overflow: hidden;
}

</style>
